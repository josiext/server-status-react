import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "../constants/colors";

const TypographyMessage = styled(Typography)(() => ({
  fontSize: 14,
  color: colors.text,
  textAlign: "center",
  fontStyle: "italic",
}));

const NodeMessage = ({ children }: { children: string }) => {
  return <TypographyMessage>{children}</TypographyMessage>;
};

export default NodeMessage;
