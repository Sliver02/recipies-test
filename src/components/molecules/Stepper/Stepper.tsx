import { Fragment } from "react";
import classNames from "classnames";
import styles from "./Stepper.module.scss";

export interface StepperProps {
	steps: string[];
	currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => (
	<div className={styles.stepper}>
		{steps.map((label, i) => (
			<Fragment key={i}>
				<div
					className={classNames(styles.stepItem, {
						[styles.stepDone]: i < currentStep,
						[styles.stepActive]: i === currentStep,
					})}
				>
					<div className={styles.stepCircle}>{i < currentStep ? "✓" : i + 1}</div>
					<span className={styles.stepLabel}>{label}</span>
				</div>
				{i < steps.length - 1 && (
					<div
						className={classNames(styles.stepConnector, {
							[styles.stepConnectorDone]: i < currentStep,
						})}
					/>
				)}
			</Fragment>
		))}
	</div>
);
