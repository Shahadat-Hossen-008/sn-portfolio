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
        <Body>
          <Section className="pb-5 bg-white">
            <Row>
              <Text className="text-2xl leading-[1.3] font-semibold text-black pb-8">
                <span className="font-bold">Subject:</span> {subject}
              </Text>
              <Text className="text-base leading-[1.4] text-black p-6 bg-[#ebf2f2] rounded">
                {message}
              </Text>
              <br />
              <Hr />
              <Text className="text-base leading-[1.4] text-black">
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
