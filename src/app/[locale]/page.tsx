"use client";

import { SearchWizard } from "@/components/organisms/SearchWizard";
import { Container } from "@/components/atoms/Grid/Container/Container";
import { Row } from "@/components/atoms/Grid/Row/Row";
import { Col } from "@/components/atoms/Grid/Col/Col";
import { Justify } from "@/components/atoms/Grid/interfaces";

export default function Page() {
	return (
		<Container>
			<Row xsJustify={Justify.center}>
				<Col xs={12} lg={6} xl={5}>
					<SearchWizard />
				</Col>
			</Row>
		</Container>
	);
}
