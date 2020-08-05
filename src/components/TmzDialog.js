import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

export function TmzDialog(args)
{
    const [ open, setOpen] = useState(true);
    
    function tmzPaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
            </Draggable>
        );
    }
    
    return (<div> 
    <Dialog
        open={open}
        onClose={()=>{setOpen(false)}}
        PaperComponent={tmzPaperComponent}
        aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {args.title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>{args.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
            {args.onClickOk != null && 
                <Button autoFocus onClick={()=>{args.onClickOk(); setOpen(false);}} color="primary">
                    ok
                </Button>
            }
            {args.onClickCancel != null && 
                <Button autoFocus onClick={()=>{args.onClickCancel(); setOpen(false);}} color="primary">
                    cancel
                </Button>
            }
        </DialogActions>
    </Dialog>
    </div>)
    }


