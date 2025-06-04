import {
	Box,
	Card,
	CardBody,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useSteps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type React from "react";

const MotionCard = motion(Card);

interface TutorialStep {
	title: string;
	description: string;
	color: string;
}

interface TutorialStepperProps {
	steps: TutorialStep[];
	currentStep: number;
	size?: "sm" | "md" | "lg";
}

/**
 * チュートリアル用高級ステッパー
 * ガラスモーフィズムとアニメーション効果を持つ美しいステッパー
 */
export const TutorialStepper: React.FC<TutorialStepperProps> = ({
	steps,
	currentStep,
	size = "lg",
}) => {
	const { activeStep } = useSteps({
		index: currentStep,
		count: steps.length,
	});

	// レスポンシブ対応
	const stepperOrientation = useBreakpointValue({
		base: "vertical",
		md: "horizontal",
	}) as "vertical" | "horizontal";

	// カラーテーマ
	const cardBg = useColorModeValue("whiteAlpha.100", "gray.800");

	return (
		<MotionCard
			bg={cardBg}
			backdropFilter="blur(20px)"
			borderRadius="3xl"
			shadow="2xl"
			border="1px solid"
			borderColor="whiteAlpha.300"
			overflow="hidden"
			initial={{ opacity: 0, y: 30 }}
			animate={{
				opacity: 1,
				y: 0,
				boxShadow: [
					"0 0 20px rgba(139, 92, 246, 0.3)",
					"0 0 40px rgba(139, 92, 246, 0.6)",
					"0 0 20px rgba(139, 92, 246, 0.3)",
				],
			}}
			transition={{
				opacity: { duration: 0.6, delay: 0.2 },
				y: { duration: 0.6, delay: 0.2 },
				boxShadow: {
					duration: 2,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				},
			}}
		>
			<CardBody p={10}>
				<Stepper
					index={activeStep}
					orientation={stepperOrientation}
					gap="6"
					colorScheme="purple"
					size={size}
				>
					{steps.map((step, index) => (
						<Step key={index}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon />}
									incomplete={<StepNumber />}
									active={<StepNumber />}
								/>
							</StepIndicator>

							<Box flexShrink="0">
								<StepTitle>
									<Text
										fontWeight="bold"
										fontSize="lg"
										color={
											index === activeStep ? `${step.color}.600` : "gray.600"
										}
									>
										{step.title}
									</Text>
								</StepTitle>
								<StepDescription>
									<Text fontSize="md" color="gray.500">
										{step.description}
									</Text>
								</StepDescription>
							</Box>

							<StepSeparator />
						</Step>
					))}
				</Stepper>
			</CardBody>
		</MotionCard>
	);
};
