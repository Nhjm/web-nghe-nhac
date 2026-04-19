import { FileWithPath, useDropzone } from "react-dropzone";
import "./theme.css";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";
import { sendRequestFile } from "@/utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

function InputFileUpload() {
    return (
        <Button
            onClick={(e) => e.preventDefault()}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

interface TrackUPloadProps {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
}

interface IProps {
    setTrackUPloadProps: React.Dispatch<React.SetStateAction<TrackUPloadProps>>
    setValue: (value: number) => void;
    setProgress: (value: number) => void;
    TrackUPloadProps: TrackUPloadProps;
}

const Step1 = (props: IProps) => {
    const { data: session } = useSession();

    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            if (acceptedFiles.length === 0) return;

            const fileAudio = acceptedFiles[0];
            props.setProgress(0);
            props.setTrackUPloadProps(prev => ({
                ...prev,
                percent: 0,
                fileName: fileAudio.name
            }));
            props.setValue(1);

            const formData = new FormData();
            formData.append("fileUpload", fileAudio);

            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/files/upload`, formData, {
                    headers: {
                        "Authorization": `Bearer ${session?.access_token}`,
                        "target_type": "tracks",
                        delay: 5000
                    },
                    onUploadProgress: progressEvent => {
                        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);

                        props.setTrackUPloadProps(prev => ({
                            ...prev,
                            percent: percentCompleted
                        }))
                    }
                });

                props.setTrackUPloadProps(prev => ({
                    ...prev,
                    uploadedTrackName: res.data.data.fileName
                }))
            } catch (error) {
                //@ts-ignore
                alert(error?.response?.data?.message || "Upload failed");
            }
        },
        [session],
    );
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            onDrop,
            accept: {
                "audio/*": [".mp3"],
            },
        });

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <InputFileUpload />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
};

export default Step1;
