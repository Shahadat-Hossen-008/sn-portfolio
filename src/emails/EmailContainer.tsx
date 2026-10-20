import {
  Body,
  Hr,
  Html,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { EmailContainerProps } from "./EmailConPropsType";

export default function EmailContainer({
  name,
  email,
  subject,
  message,
}: EmailContainerProps) {
  return (
    <Html>
      <Tailwind>
        <Body style={{ backgroundColor: "#e2dbc9" }}>
          <Section style={{ backgroundColor: "#e2dbc9", paddingBottom: "20px" }}>
            <Row>
              <Text
                style={{
                  color: "#052f21",
                  fontSize: "24px",
                  lineHeight: 1.3,
                  fontWeight: 600,
                  paddingBottom: "32px",
                }}
              >
                <span className="font-bold">Subject:</span> {subject}
              </Text>
              <Text
                style={{
                  color: "#052f21",
                  fontSize: "16px",
                  lineHeight: 1.4,
                  padding: "24px",
                  backgroundColor: "#ebe6d8",
                  borderRadius: "4px",
                }}
              >
                {message}
              </Text>
              <br />
              <Hr />
              <Text
                style={{ color: "#052f21", fontSize: "16px", lineHeight: 1.4 }}
              >
                Best,
                <br />
                Name :{name}
                <br />
                Reply To: {email}
              </Text>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
