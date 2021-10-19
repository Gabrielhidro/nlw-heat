import axios from 'axios'

/**
 * Receber code(string)
 * Recuperar o access_token no github
 * verificar se o usuário existe no DB
 * ---SIM = Gerar token
 * ---NÃO = Cria DB e gera token
 * Retornar token com infos do user
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  name: string,
  id: number,
}

class AuthenticateUserService {
  async execute(code: string){
    const url = 'https://github.com/login/oauth/access_token';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: 'application/json'
      }
    })

    const response = await axios.get<IUserResponse>("http://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })

    return response.data;
  }
}

export {AuthenticateUserService}