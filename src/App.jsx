import { Routes, Route } from 'react-router-dom';
import Publica from './components/Publica';
import Layout from './components/Layout';

import Entrada from './pages/Entrada';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import Perfil from './pages/Perfil';
import AlterarSenha from './pages/AlterarSenha';

import Inicio from './pages/Inicio';
import EscolherServico from './pages/agendar/EscolherServico';
import EscolherMecanico from './pages/agendar/EscolherMecanico';
import EscolherHorario from './pages/agendar/EscolherHorario';
import Confirmar from './pages/agendar/Confirmar';
import Enviado from './pages/agendar/Enviado';
import MeusAgendamentos from './pages/MeusAgendamentos';
import Horario from './pages/Horario';
import Avaliar from './pages/Avaliar';
import Mecanicos from './pages/Mecanicos';
import Mecanico from './pages/Mecanico';

import Agenda from './pages/admin/Agenda';
import AConfirmar from './pages/admin/AConfirmar';
import Negocio from './pages/admin/Negocio';
import Recursos from './pages/admin/Recursos';
import Recurso from './pages/admin/Recurso';
import Horarios from './pages/admin/Horarios';
import Servicos from './pages/admin/Servicos';
import Servico from './pages/admin/Servico';
import Avaliacoes from './pages/admin/Avaliacoes';

import NaoEncontrado from './pages/NaoEncontrado';

export default function App() {
  return (
    <Routes>
      <Route element={<Publica />}>
        <Route path="/" element={<Entrada />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/alterar-senha" element={<AlterarSenha />} />

        <Route path="/inicio" element={<Inicio />} />
        <Route path="/agendar" element={<EscolherServico />} />
        <Route path="/agendar/mecanico" element={<EscolherMecanico />} />
        <Route path="/agendar/horario" element={<EscolherHorario />} />
        <Route path="/agendar/confirmar" element={<Confirmar />} />
        <Route path="/agendar/enviado" element={<Enviado />} />
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/agendamentos/:id" element={<Horario />} />
        <Route path="/agendamentos/:id/avaliar" element={<Avaliar />} />
        <Route path="/mecanicos" element={<Mecanicos />} />
        <Route path="/mecanicos/:id" element={<Mecanico />} />
      </Route>

      <Route element={<Layout permissao="api.change_organizacao" />}>
        <Route path="/admin/agenda" element={<Agenda />} />
        <Route path="/admin/a-confirmar" element={<AConfirmar />} />
        <Route path="/admin/agendamentos/:id" element={<Horario />} />
        <Route path="/admin/negocio" element={<Negocio />} />
        <Route path="/admin/mecanicos" element={<Recursos />} />
        <Route path="/admin/mecanicos/novo" element={<Recurso />} />
        <Route path="/admin/mecanicos/:id" element={<Recurso />} />
        <Route path="/admin/mecanicos/:id/horarios" element={<Horarios />} />
        <Route path="/admin/servicos" element={<Servicos />} />
        <Route path="/admin/servicos/novo" element={<Servico />} />
        <Route path="/admin/servicos/:id" element={<Servico />} />
        <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
      </Route>

      <Route path="*" element={<NaoEncontrado />} />
    </Routes>
  );
}