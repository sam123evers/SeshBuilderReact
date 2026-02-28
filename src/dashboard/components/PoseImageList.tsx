// import { MouseEventHandler } from "react";
import { Box, Button, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { IPose } from '../../shared/declared-types.tsx';

interface IPoseImageListProps {
    seqId: number;
    seqName: string;
    poses: IPose[];
    openAddPoseToSequenceModal: Function;
}

export default function PoseImageList({
    seqId,
    seqName,
    poses = [],
    openAddPoseToSequenceModal
}: IPoseImageListProps) {
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
                    <ImageListItemBar title={poseObj.poseName}/>
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