import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { IPose } from '../../shared/declared-types.tsx';
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface IPoseImageListProps {
    seqId: number;
    seqName: string;
    poses: IPose[];
    openAddPoseToSequenceModal: Function;
    toggleConfirmDelete: Function;
    setDeletePayload: Function;
}

export default function PoseImageList({
    seqId,
    seqName,
    poses = [],
    openAddPoseToSequenceModal,
    toggleConfirmDelete,
    setDeletePayload,
}: IPoseImageListProps) {
    // const [clicked, setIsClicked] = useState<boolean>(false);

    const handleIconClick = (poseName: string, seqPoseId: number) => {
        toggleConfirmDelete(true);
        setDeletePayload({
            sequenceName: seqName,
            poseName: poseName,
            sequencePoseId: seqPoseId
        })
    };
    if(poses.length > 0) {
        return(
            <ImageList rowHeight={150} sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', p: 1, justifyContent: 'center' }}>
                {poses.map((poseObj, index) => (
                  <ImageListItem key={index}>
                    <img 
                      srcSet={`${poseObj.photoUrl}`}
                      src={`${poseObj.photoUrl}`}
                      alt={poseObj.poseName}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover'  }}
                    />
                    <ImageListItemBar 
                        title={poseObj.poseName} 
                        actionIcon={
                            <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} onClick={() => handleIconClick(poseObj.poseName, poseObj.sequencePoseId)}>
                                X
                            </IconButton>
                        }
                    />
                  </ImageListItem>
                ))}
            </ImageList>
        )
    } else {
        return (
            <Box sx={{marginTop: '10px', display:'flex', justifyContent: 'center'}}>
                <Button onClick={() => openAddPoseToSequenceModal(seqId, seqName)}>+ Add Pose to Sequence</Button>
            </Box>
        )
    }
    
    
}