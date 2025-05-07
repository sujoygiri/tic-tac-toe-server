import { Request, Response, NextFunction } from "express";

type Player = {
  id: string;
  name: string;
};

class Queue<T> {
  private player: T[] = [];

  enqueue(item: T): void {
    this.player.push(item);
  }

  dequeue(): T | undefined {
    return this.player.shift();
  }

  peek(): T | undefined {
    return this.player[0];
  }

  isEmpty(): boolean {
    return this.player.length === 0;
  }

  size(): number {
    return this.player.length;
  }

  traverse(callback: (item: T) => void): void {
    this.player.forEach(callback);
  }
}

export const joinInQueuePlayer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerQueue = new Queue<Player>();
  const player1 = {
    id: "1234",
    name: "Joy",
  };
  playerQueue.enqueue(player1);
  playerQueue.traverse((player) => {
    console.log(player); // Replace with desired logic for each player
  });
  res.json(playerQueue);
};

const findPlayer = (req: Request, res: Response, next: NextFunction) => {};
