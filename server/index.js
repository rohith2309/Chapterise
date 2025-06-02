import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function extractChaptersFromHTML(htmlContent) {
  try {
    const ytInitialDataMatch = htmlContent.match(/ytInitialData = ({.*?});/);
    if (!ytInitialDataMatch) return null;

    const data = JSON.parse(ytInitialDataMatch[1]);
    const engagementPanels = data.engagementPanels || [];

    for (const panel of engagementPanels) {
      const contents = panel?.engagementPanelSectionListRenderer?.content
        ?.macroMarkersListRenderer?.contents;

      if (contents) {
        return contents
          .map(item => {
            const marker = item.macroMarkersListItemRenderer;
            if (!marker) return null;

            return {
              timestamp: marker.timeDescription?.simpleText || '',
              title: marker.title?.simpleText || 'Untitled',
              completed: false
            };
          })
          .filter(Boolean);
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing YouTube data:', error);
    return null;
  }
}

app.post('/api/chapters', async (req, res) => {
  const { videoId } = req.body;
  
  try {
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const chapters = extractChaptersFromHTML(response.data);
    
    if (chapters && chapters.length > 0) {
      res.json({ success: true, chapters });
    } else {
      res.json({ success: false, message: 'No chapters found' });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching chapters',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});