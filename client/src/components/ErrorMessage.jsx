import React from 'react';

export default function ErrorMessage(props) {
	return(
		<div>
			{
				props.errMsg
				? <p>{props.errMsg}</p>
				: <p>The application is working fine</p>
			}
		</div>
	)
}