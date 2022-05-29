import React from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default() => {
    return (
       <Menu stackable style={{ marginTop: '50px' }}>
           <Button color='blue' as={Link} to='/tokens'>
               Gestión de Tokens ERC-20
           </Button>
           <Button color='green' as={Link} to='/loteria'>
               Gestión de boletos
           </Button>
           <Button color='orange' as={Link} to='/premios'>
               Premios de lotería
           </Button>
           <Button color='linkedin' href="https://www.linkedin.com/in/antonio-p-a2a1352a/">
               <Icon name='linkedin' />linkedIn
           </Button>
           <Button color='red' href="https://www.instagram.com/joaneeet7/?hl=es">
             <Icon name='instagram' /> Instagram
           </Button>
           <Button color='facebook' href="https://www.facebook.com/joaneeet7/">
               <Icon name='facebook' /> Facebook
           </Button>
       </Menu>
    );
}
