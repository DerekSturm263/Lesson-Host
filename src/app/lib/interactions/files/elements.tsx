'use client'

import Image from 'next/image';
import { ElementID, ComponentMode, InteractionProps, InteractionPackage } from "@/app/lib/types";
import { useState } from "react";
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';

export type InteractionType = {
  files: File[]
};

type File = {
  source: string,
  isDownloadable: boolean
};

const defaultValue: InteractionType = {
  files: [
    {
      source: "",
      isDownloadable: false
    }
  ]
}

const schema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: {
            type: Type.STRING
          },
          isDownloadable: {
            type: Type.BOOLEAN
          }
        },
        required: [
          "source",
          "isDownloadable"
        ],
        propertyOrdering: [
          "source",
          "isDownloadable"
        ]
      },
      minItems: 1,
      maxItems: 3
    }
  },
  required: [
    "files"
  ],
  propertyOrdering: [
    "files"
  ]
};

function Component(props: InteractionProps) {
  const [ files, setFiles ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).files);

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
    <Stack>
      <Stack
        sx={{ flexGrow: 1 }}
        direction="row"
        spacing={2}
      >
        {files.map((item, index) => (
          <FileItem
            key={index}
            elementID={props.elementID}
            isDisabled={props.isDisabled}
            mode={props.mode}
            item={item}
            index={index}
          />
        ))}
      </Stack>

      <Button
        onClick={(e) => { addFile() }}
      >
        Add File
      </Button>
    </Stack>
  );
}

function FileItem({ elementID, isDisabled, mode, item, index }: { elementID: ElementID, isDisabled: boolean, mode: ComponentMode, item: File, index: number }) {
  const [ source, setSource ] = useState(item.source);
  const [ isDownloadable, setIsDownloadable ] = useState(item.isDownloadable);
  
  const extension = source.substring(source.length - 3);

  return (
    <Stack>
      {mode == ComponentMode.Edit && (
        <>
          <TextField
            label="Source"
            autoComplete="off"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
            }}
          />

          <IconButton
            onClick={(e) => {}}
          >
            <Delete />
          </IconButton>
        </>
      )}
      
      {extension == "png" ? (
        <Image
          src={source}
          alt={source}
        />
      ) : extension == "mp4" ? (
        <video
          src={source}
          controls
        ></video>
      ) : extension == "mp3" ? (
        <audio
          src={source}
          controls
        ></audio>
      ) : (
        <></>
      )}
    </Stack>
  );
}

const interaction: InteractionPackage = {
  id: "files",
  prettyName: "Files",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
