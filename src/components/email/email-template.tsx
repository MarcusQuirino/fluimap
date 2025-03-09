import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  username?: string;
}

const baseUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";

const SurveyEmail = ({ username = "Steve" }: WelcomeEmailProps) => {
  const previewText = `Anwser you survey, ${username}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Section className="mt-8">
              <Img
                src={`${baseUrl}/static/example-logo.png`}
                width="80"
                height="80"
                alt="Logo Example"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Answer your survey, {username}!
            </Heading>
            <Text className="text-sm">Hello {username},</Text>
            <Text className="text-sm">
              You have been invited to answer a the FluiMap survey. Please click
              the button below to answer the survey.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#00A3FF] px-4 py-2 text-center text-xs font-semibold text-white no-underline"
                href={`${baseUrl}`}
              >
                Get Started
              </Button>
            </Section>
            <Text className="text-sm">
              Cheers,
              <br />
              FluiMap
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SurveyEmail;
