import React from "react";
import { Box } from "@chakra-ui/react";

interface StatusIndicatorProps {
    isRunning: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isRunning }) => {
    return (
        <Box mb={4}>
            <Box as="span" mr={2} fontSize="20px">
                Status
            </Box>
            <Box
                width="15px"
                height="15px"
                borderRadius="50%"
                bg={isRunning ? "green" : "red"}
                display="inline-block"
            />
        </Box>
    );
};

export default StatusIndicator;
