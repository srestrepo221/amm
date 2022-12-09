import { useSelector, useDispatch } from  'react-redux'
import Table from 'react-bootstrap/Table';
import { ethers } from 'ethers';

import { useEffect } from 'react'

//import Loading from './Loading';

import { 
	loadAllSwaps
} from '../store/interactions'

const Charts = () => {
	const provider = useSelector(state => state.provider.connection)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)

	const amm = useSelector(state => state.amm.contract)
	const swaps = useSelector(state => state.amm.swaps)

	const dispatch = useDispatch()

	useEffect(() => {
		if(provider && amm) {
			loadAllSwaps(provider, amm, dispatch)
		}
	}, [provider, amm, dispatch])

	return (
		<Table striped bordered={1} hover>
			<thead>
				<tr>
					<th>Transaction Hash</th>
					<th>Token Give</th>
					<th>Amount Give</th>
					<th>Token Get</th>
					<th>Token Give</th>
					<th>User</th>
					<th>Time</th>
				</tr>
			</thead>
			<tbody>
				{swaps && swaps.map((swap, index) => (
					<tr key={index}>
					<td>{swap.hash.slice(0, 5) + '...' + swap.hash.slice(61, 66)}</td>
					<td>{swap.args.tokenGive === tokens[0].address ? symbols[0] : symbols[1]}</td>
					<td>{ethers.utils.formatUnits(swap.args.tokenGiveAmount.toString(), 'ether')}</td>
					<td>{swap.args.tokenGet === tokens[0].address ? symbols[0] : symbols[1]}</td>
					<td>{ethers.utils.formatUnits(swap.args.tokenGetAmount.toString(), 'ether')}</td>
					<td>{swap.args.user.slice(0, 5) + '...' + swap.args.user.slice(38, 42)}</td>
					<td>{

						new Date(Number(swap.args.timestamp.toString() + '000'))
						.toLocaleDateString(
						undefined, 
						{
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric'
						})

					}</td>
				</tr>
				))}
				
			</tbody>
		</Table>
	);
}

export default Charts;
