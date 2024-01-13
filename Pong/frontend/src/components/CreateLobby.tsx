import React from 'react';

export type CreateLobbyProps = {
	labels: string[];
	scores: string[];
	buttonSubmit: string;
	submit: () => void;
	state: string;
	setState: React.Dispatch<React.SetStateAction<string>>;
};

const CreateLobby: React.FC<CreateLobbyProps> = ({
	labels,
	scores,
	buttonSubmit,
	submit,
	state,
	setState,
}) => {
	const playOptions: Array<{ key: number; title: string; score: string }> = [];

	for (let i = 0; i < labels.length; i++) {
		playOptions.push({ key: i, title: labels[i], score: scores[i] });
	}

	return (
		<div className="divPlayLocal">
			<div className="divPlayLocalList">
				{playOptions.map((play) => {
					return (
						<label key={play.key} className="container">
							<input
								type="radio"
								value={play.score}
								name={play.score}
								checked={play.score === state}
								onChange={() => {
									setState(play.score);
								}}
							/>
							<span className="checkmark"></span>
							{play.title}
						</label>
					);
				})}
			</div>
			<button id="submitButton" onClick={submit}>
				{buttonSubmit}
			</button>
		</div>
	);
};

export default CreateLobby;
