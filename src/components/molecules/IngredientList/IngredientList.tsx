import styles from "./IngredientList.module.scss";

export interface Ingredient {
	name: string;
	measure: string;
}

export interface IngredientListProps {
	ingredients: Ingredient[];
}

export const IngredientList = ({ ingredients }: IngredientListProps) => (
	<ul className={styles.list}>
		{ingredients.map(({ name, measure }) => (
			<li key={name} className={styles.item}>
				<span className={styles.name}>{name}</span>
				{measure && <span className={styles.measure}>{measure}</span>}
			</li>
		))}
	</ul>
);
