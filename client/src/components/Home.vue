<template>
    <div class="container">
        <div class="stats container">
            <div v-if="gameState.status === 'ended'">
                <h1 v-if="gameState.playerOneScore > gameState.playerTwoScore">
                    Победил игрок 1
                </h1>
                <h1 v-else>Победил игрок 2</h1>
            </div>
            <div v-if="gameState.status === 'started'">
                <h2>Статистика</h2>

                <p>
                    Cчет 1 ого игрока:
                    <span id="mines" class="badge bg-danger">
                        {{ gameState.playerOneScore }}</span
                    >
                </p>
                <p>
                    Cчет 2 ого игрока:
                    <span id="mines" class="badge bg-danger">
                        {{ gameState.playerTwoScore }}</span
                    >
                </p>
                <div class="row mt-3">
                    <h4>
                        <span id="moves" class="badge bg-primary">
                            {{ mapping(gameState.status) }}. Ход
                            {{ mapping(gameState.currentPlayer) }}</span
                        >
                    </h4>
                </div>
            </div>
        </div>
        <div class="board container">
            <div class="row mt-3"></div>
            <table class="table">
                <tbody>
                    <tr v-for="(row, i) in gameState.openField">
                        <td
                            v-for="(el, j) in row"
                            class="cell"
                            @click="sendCell(i, j)"
                        >
                            {{ el ? el : ' ' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row mt-3">
            <div class="col-md-12 text-center">
                <button @click="startNewGame" class="btn btn-md btn-primary">
                    Начать новую игру
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export default defineComponent({
    data: (): {
        socket: null | Socket;
        n: number;
        message: string;
        messages: [];
        gameState: {
            status: string;
            currentPlayer: string;
            diamondsCount: number;
            n: number;
            openField: any;
            playerOneScore: number;
            playerTwoScore: number;
        };
    } => ({
        socket: null,
        n: 6,
        message: '',
        messages: [],
        gameState: {
            status: 'ready',
            currentPlayer: 'playerOneScore',
            diamondsCount: 0,
            n: 0,
            openField: [],
            playerOneScore: 0,
            playerTwoScore: 0,
        },
    }),
    methods: {
        mapping(data: string) {
            switch (data) {
                case 'ready':
                    return 'Игра не началась';
                case 'started':
                    return 'Игра идет';
                case 'ended':
                    return 'Игра закончилась';
                case 'playerOneScore':
                    return 'первого игрока';
                case 'playerTwoScore':
                    return 'второго игрока';
            }
            return '';
        },
        async startNewGame() {
            const res = await axios.post(
                'http://localhost:3030/start-new-game',
                { n: this.n, m: this.n },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST',
                    },
                }
            );
            this.gameState = res.data;
            this.setupSocketConnection();
        },
        async sendCell(i: number, j: number) {
            this.socket?.emit('openCell', JSON.stringify({ data: { i, j } }));
        },
        setupSocketConnection() {
            this.socket = io('http://localhost:3030', {
                transports: ['websocket'],
            });

            this.socket.on('state', (data: string) => {
                this.gameState = JSON.parse(data);
            });

            this.socket.on('connect_error', (e: Error) => {
                console.log(e);
            });
        },
    },
    mounted() {},
});
</script>
<style scoped>
.cell {
    background-color: white;
    border: 0.5rem solid #0dcaf0;
    text-align: center;
    font-size: 32px;
    font-weight: 500;
    min-width: 100px;
    height: 100px;
    vertical-align: middle;
}
</style>
