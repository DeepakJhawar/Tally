import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Modal, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { customStyles } from "../../constants/customStyles";

const Submissions = ({ submissions }) => {
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  const parseSubmission = (submission) => {
    return {
      code: submission.code,
      verdict: submission.verdict,
      language: submission.language,
      submittedAt: new Date(submission.submittedAt).toLocaleString(), // Format date
    };
  };

  const handleOpen = (code) => {
    setCurrentCode(code);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {submissions.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: '0 auto', borderRadius: '8px', maxHeight: '90vh', overflowY: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Submitted At</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Verdict</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Language</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission, index) => {
                const parsed = parseSubmission(submission);
                const verdictColor = parsed.verdict === "ACCEPTED" ? "green" : "red";
                return (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2">{parsed.submittedAt}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: verdictColor, cursor: "pointer", "&:hover": { textDecoration: "underline" } }} onClick={() => handleOpen(parsed.code)}>
                        {parsed.verdict}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{parsed.language}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center" }}>No submissions available.</Typography>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="code-modal-title"
        aria-describedby="code-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography id="code-modal-title" variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              Submission Code
            </Typography>
            <IconButton
              onClick={copyToClipboard}
              sx={{ color: "#007bff" }}
              aria-label="copy to clipboard"
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography id="code-modal-description" variant="body1">
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", backgroundColor: "secondary", padding: "16px", borderRadius: "8px", overflowX: "auto" }}>
              {currentCode}
            </pre>
          </Typography>
          <Button
            sx={{ ...customStyles.control, marginTop: 2, alignSelf: 'flex-end' }}
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Submissions;
