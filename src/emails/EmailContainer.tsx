import {
  Body,
  Hr,
  Html,
  Row,
  Section,
  Text,
} from '@react-email/components';

type EmailContainerProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function EmailContainer({ name, email, subject, message }: EmailContainerProps) {
  return (
    // Here we give template literal string because sendEmail consider this jsx not string
   <Html>
        <Body>
            <Section className="pb-5 bg-white">
              <Row>
                <Text className="text-2xl leading-[1.3] font-bold text-black pb-8">
                   <span className= "text-3xl font-bold">Subject:</span> {subject} 
                </Text>
                <Text className="text-lg leading-[1.4] text-[#484848] p-6 bg-[#adb3b3] rounded">
                  {message}
                </Text>
                <br/>
                <Hr/>
                <Text className="text-lg leading-[1.4] text-[#484848]">
                  Best,
                  <br/>
                  Name :{name}
                  <br/>
                  E-mail: {email}
                </Text>
              </Row>
            </Section>
        </Body>
    </Html>
  )
}