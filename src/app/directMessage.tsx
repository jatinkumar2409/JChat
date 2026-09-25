import { UserDTO } from '@/core/models/User';
import DirectMessageScreen from "@/features/chat/screens/DirectMessageScreen";
import { useLocalSearchParams } from 'expo-router';
import { webSocketManager, WebSocketState } from '@/core/websockets/WebSocketManager';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../config';
function DirectMessageRoute() {
    const { user } = useLocalSearchParams<{ user: string }>();
    let userObj : UserDTO = JSON.parse(user);
    return <DirectMessageScreen user={userObj}/>
    
}

export default DirectMessageRoute
