'use client'

import Box from '@mui/material/Box';
import Image from 'next/image';
import { ElementID, ComponentMode, InteractionProps } from "@/app/lib/types";
import { useState } from "react";
import * as helpers from '@/app/lib/helpers';

type File = {
  source: string,
  isDownloadable: boolean
};

type Files = {
  files: File[]
};

function Files({ elementID, isDisabled, mode }: InteractionProps) {
  const [ files, setFiles ] = useState(helpers.getInteractionValue<Files>(elementID).files);

  function addFile() {
    const newFiles = files;
    newFiles.push({
      source: "",
      isDownloadable: false
    });
    setFiles(newFiles);
  }

  function removeFile(index: number) {
    const newFiles = files;
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      {files.map((item, index) => (
        <FileItem
          key={index}
          elementID={elementID}
          isDisabled={isDisabled}
          mode={mode}
          item={item}
          index={index}
        />
      ))}
    </Box>
  );
}

function FileItem({ elementID, isDisabled, mode, item, index }: { elementID: ElementID, isDisabled: boolean, mode: ComponentMode, item: File, index: number }) {
  const [ source, setSource ] = useState(item.source);
  const [ isDownloadable, setIsDownloadable ] = useState(item.isDownloadable);
  
  const fileType = source.substring(source.length - 3) == "png" ? ("png") :
  source.substring(source.length - 3) == "mp4" ? ("mp4") :
  source.substring(source.length - 3) == "mp3" ? ("mp3") : "other";

  switch (fileType) {
    case "png":
      return (
        <Image
          src={item.source}
          alt={item.source}
        />
      );

    case "mp4":
      return (
        <video
          src={item.source}
          controls
        ></video>
      );

    case "mp3":
      return (
        <audio
          src={item.source}
          controls
        ></audio>
      );

    case "other":
      return (
        <></>
      );
  }
}

export default Files;
