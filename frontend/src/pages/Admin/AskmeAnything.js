import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

function AskMeAnything() {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_ADMIN_URL}/adminquery`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const adminToken = Cookies.get('token');

    const headers = {
      Authorization: `Bearer ${adminToken}`
    };
    
    try {
      const response = await axios.post(API_ENDPOINT, { question } ,{ headers });
      setAnswers(response.data);
    } catch (error) {
      console.error('There was an error processing the question:', error);
      setAnswers([['Sorry, I do not have the requested data at the moment.']]);
    }
    setLoading(false);
  };

  return (
    <>
      <Box style={{ background: '#ffffff', padding: '50px 0', textAlign: 'center' }}>
        <Typography variant="h4" style={{ color: '#000' }}>
          Let me assist you with your administrative queries
        </Typography>
        <Typography variant="h6" style={{ color: '#000' }}>
          Simply ask a question like, "Who are all the students in the Data Science course?" or "List all professors," and I'll provide the precise information you need.
        </Typography>
      </Box>
      <Container component="main" maxWidth="md" style={{ marginTop: '50px', marginBottom: '500px' }}>
        <Paper elevation={6} style={{ padding: '20px', marginTop: '50px', background: '#c8e6c9' }}>
          <Typography component="h1" variant="h5" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#000' }}>
            <LightbulbIcon style={{ marginRight: '8px', color: '#000' }} />
            Ask Me Anything?
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="question"
              label="What's your question?"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QuestionMarkIcon sx={{ color: '#000', marginRight: '8px' }} />
                  </InputAdornment>
                ),
                style: { color: '#000' },
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="success"
                disabled={loading}
              >
                Submit
              </Button>
            </Box>
            {loading && <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto', color: '#000' }} />}
          </form>
          {answers.length > 0 && (
            <div style={{ marginTop: '20px', color: '#000', background: '#a5d6a7', padding: '10px', borderRadius: '5px' }}>
              {answers.map((answer, index) => (
                <Typography key={index} variant="body2">{answer.join(', ')}</Typography>
              ))}
            </div>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default AskMeAnything;
