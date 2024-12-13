import { Html, Head, Font, Preview, Row, Section, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

const VerificationEmail = ({ username, otp }
    : VerificationEmailProps
) => {
  return (
    <Html>
        <Head>
            <title>Verification Email</title>
            <Font 
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    format: 'woff2'
                }}
                fontWeight={400}
                fontStyle="normal"
            />
        </Head>
        <Preview>Your verification code is: {otp}</Preview>
        <Section>
            <Row>
                <Text>Hello {username}</Text>
                <Text>Thank you for signing up! Please use the following code to verify your account:</Text>
            </Row>
            <Row>
                <Text>{otp}</Text>
            </Row>
            <Row>
                <Text>If you did not sign up for this account, please ignore this email.</Text>
            </Row>
        </Section>
    </Html>
  );
}

export default VerificationEmail;