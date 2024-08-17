'use client'

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Toolbar, Typography, TextField, Grid, Card, CardActionArea, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
//import db from "@/firebase";

let db;
if (typeof window !== 'undefined') {
    const { db: fs } = require('@/firebase');
    db = fs;
}


export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser();
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState(false);
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text
        }).then(res => res.json())
        .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if(!name){
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docsnap = await getDoc(userDocRef)

        if(!docsnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert('Name already exists')
                return
            } else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colref = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colref)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return <Container maxwidth="md">
            <Box sx={{
                mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
            >
                <Typography variant="h4">Generate Flashcards</Typography>
                <Paper sx={{p: 4, width: '100%'}}>
                    <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter Text"
                    multiline
                    rows={4}
                    fullWidth
                    variant='outlined'
                    sx={{
                        mb: 2
                    }} />
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                        Generate Flashcards
                    </Button>
                </Paper>
            </Box>

            {flashcards.length > 0 &&
                <Box sx={{mt: 4}}>
                    <Typography variant="h5" sx={{mb: 2}}>Generated Flashcards</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: '0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px  0 rgba(0,0,0,0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                    },
                                                    '& > div >:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    },
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant='h5' component='div'>
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                                {/* <Paper sx={{p: 2, height: '100%'}}>
                                    <Typography variant="h6" sx={{mb: 2}}>{flashcard.front}</Typography>
                                    <Typography>{flashcard.back}</Typography>
                                </Paper> */}
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{mt: 4, display:'flex', justifyContent: 'center'}}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save Flashcards
                        </Button>
                    </Box>
                </Box>
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your flashcards
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Collection Name"
                        fullWidth
                        variant='outlined'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
}