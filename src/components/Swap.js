import { useState, useEffect } from 'react'
import { useSelector } from  'react-redux'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';

const Swap = () => {
	const [inputToken, setInputToken] = useState(null)
	const [outputToken, setOutputToken] = useState(null)
	const [inputAmount, setInputAmount] = useState(0)
	const [outputAmount, setOutputAmount] = useState(0)

	const [price, setPrice] = useState(0)

	const account = useSelector(state => state.provider.account)

	const tokens = useSelector(state => state.tokens.contracts)
	const symbols = useSelector(state => state.tokens.symbols)
	const balances = useSelector(state => state.tokens.balances)

	const amm = useSelector(state => state.amm.contract)

	const inputHandler = async (e) => {
		if(!inputToken || !outputToken) {
			window.alert('Please select Token')
			return
		}

		if(inputToken === outputToken){
			window.alert('Invalid token pair')
			return
		}

		if(inputToken === 'DAPP') {
			setInputAmount(e.target.value)
			const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm.calculateToken1Swap(_token1Amount)
			const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether')

			setOutputAmount(_token2Amount.toString())

		} else {
			setInputAmount(e.target.value)

			const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether')
			const result = await amm.calculateToken2Swap(_token2Amount)
			const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether')

			setOutputAmount(_token1Amount.toString())
		}
	}

	const getPrice = async () => {
		if(inputToken === outputToken) {
			setPrice(0)
			return
		}

		if(inputToken === 'DAPP') {
			setPrice(await amm.token2Balance() / await amm.token1Balance())
		} else {
			setPrice(await amm.token1Balance() / await amm.token2Balance())
		}
	}

	useEffect(() => {
		if(inputToken && outputToken) {
			getPrice()
		}
	}, [inputToken, outputToken]);

	return (
		<div>
		<Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
		 {account ? (
		<Form style={{ maxWidth: '450px', margin: '50px auto' }}>
		 <Row className='my-3'>
		 	  <div className='d-flex justify-content-between'>
		 	   <Form.Label><strong>Input:</strong></Form.Label>
		 	   <Form.Text muted>
		 	    Balance: {
		 	    	inputToken === symbols[0] ? (
		 	    		balances[0]
		 	    	) : inputToken === symbols[1] ? (
		 	    		balances[1]
		 	    	) : 0
		 	    }
		 	   </Form.Text>
		 	  </div>
		 	<InputGroup>
		 	  <Form.Control
		 	   		type="number"
		 	   		placeholder="0.0"
		 	   		min="0.0"
		 	   		step="any"
		 	   		onChange={(e) => inputHandler(e) }
		 	   		disabled={!inputToken}
		 	  />
		 	  	<DropdownButton
		 	  		variant="outline-secondary"
		 	  		title={inputToken ? inputToken : "Select Token"}

		 	  	>
		 	  	<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >DAPP</Dropdown.Item>
		 	  	<Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)} >USD</Dropdown.Item>
		 	  </DropdownButton>
		 	</InputGroup>
		 </Row>

		 <Row className='my-4'>
		 	<div className='d-flex justify-content-between'>
		 	   <Form.Label><strong>Output:</strong></Form.Label>
		 	   <Form.Text muted>
		 	    Balance: {
		 	    	outputToken === symbols[0] ? (
		 	    		balances[0]
		 	    	) : outputToken === symbols[1] ? (
		 	    		balances[1]
		 	    	) : 0
		 	    }
		 	   </Form.Text>
		 	</div>
		 	<InputGroup>
		 	  <Form.Control
		 	   		type="number"
		 	   		placeholder="0.0"
		 	   		value= {outputAmount === 0 ? "" : outputAmount }
		 	   		disabled
		 	  />
		 	  	<DropdownButton
		 	  		variant="outline-secondary"
		 	  		title={outputToken ? outputToken : "Select Token"}
		 	  	>
		 	  	<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAPP</Dropdown.Item>
		 	  	<Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>USD</Dropdown.Item>
		 	  </DropdownButton>
		 	</InputGroup>
		 </Row>

		 <Row className='my-3'>
		 	<Button type='submit'>Swap</Button>
		 	<Form.Text muted>
		 		Exchange Rate: {price}
		 	</Form.Text>
		 </Row>

		</Form>

		 ) : (
		 	<p
		 	 className='d-flex justify-content-center align-items-center'
		 	 style={{ height: '300px' }}
		 	>
		 	 Please connect wallet.
		 	</p>
		 )}
		 </Card>
		</div>
	);
}

export default Swap;
