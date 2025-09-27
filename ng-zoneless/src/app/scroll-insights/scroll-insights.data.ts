export interface Order {
    id: number;
    customer: string;
    total: number;
}

export const getOrders = (totalItems: number): Order[] => {
    return Array.from({ length: totalItems }, (_, i) => ({
        id: 1000 + i,
        customer: fakeName(),
        total: (i * 3) % 500 + 20,
    }))
}

const fakeName = (): string => {
    const first = ['Alex','Jordan','Taylor','Morgan','Casey','Riley','Cameron','Drew','Jamie','Avery'];
    const last  = ['Smith','Johnson','Lee','Brown','Garcia','Martinez','Davis','Clark','Lopez','Nguyen'];
    return `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`;
}