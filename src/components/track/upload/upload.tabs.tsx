"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Step1 from "@/components/track/upload/steps/step1";
import Step2 from "@/components/track/upload/steps/step2";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface TrackUPloadProps {
    fileName: string;
    percent: number;
    uploadedTrackName: string;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const UploadTab = () => {
    const [value, setValue] = useState(0);
    const [TrackUPloadProps, setTrackUPloadProps] = useState<TrackUPloadProps>({
        fileName: "",
        percent: 0,
        uploadedTrackName: "",
    });

    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                const diff = TrackUPloadProps.percent - prev;

                if (diff <= 0) return prev;

                // tăng nhanh khi xa, chậm dần khi gần
                const step = diff * 0.1;

                return prev + step;
            });
        }, 20);

        return () => clearInterval(timer);
    }, [TrackUPloadProps.percent]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", border: "1px solid #ccc" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Track" disabled={value !== 0} {...a11yProps(0)} />
                    <Tab label="Step 2" disabled={value !== 1} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Step1
                    TrackUPloadProps={TrackUPloadProps}
                    setTrackUPloadProps={setTrackUPloadProps}
                    setValue={setValue}
                    setProgress={setProgress}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Step2 progress={progress} TrackUPloadProps={TrackUPloadProps} />
            </CustomTabPanel>
        </Box>
    );
};

export default UploadTab;
