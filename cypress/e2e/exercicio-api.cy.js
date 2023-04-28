/// <reference types="cypress" />
import contrato from '../contratos/usuarios.contract';
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
         cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
         })
    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'Usuarios',
          
      }).then((response) => {
         //expect(response.body.usuarios[1].nome).to.equal('Oliver Alex')
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
          
      })
    });
    it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = `Usuario ${Math.floor(Math.random() * 100000000)}`
    let emailFaker = faker.internet.email()
    cy.cadastroUsuario(usuario, emailFaker, 'Fts45574')
        .then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })  
});  
          

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastroUsuario('Guilherme Caio', 'jjcaio.com', 'Fts45574')    
            .then((response) => {
                expect(response.body.email).to.equal('email deve ser um email válido')
                expect(response.status).to.equal(400)
            })  
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let usuario = `Usuario ${Math.floor(Math.random() * 100000000)}`
        let emailFaker = faker.internet.email()
        cy.cadastroUsuario(usuario, emailFaker, '77588204')
        .then((response) => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `Usuarios/${id}`,
                body: {
                    "nome": usuario,
                    "email": emailFaker,
                    "password": "teste122",
                    "administrador": "true"
                  }

            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let usuario = `Usuario ${Math.floor(Math.random() * 100000000)}`
        let emailFaker = faker.internet.email()
        cy.cadastroUsuario(usuario, emailFaker, '77588204')
        .then((response) => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `Usuarios/${id}`,
                })
        }).then(response => {
            expect(response.body.message).to.equal("Registro excluído com sucesso")
            expect(response.status).to.equal(200)
         })
   }); 
});
