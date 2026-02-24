export interface IPose {
  poseId: number;
  poseName: string;
  photoUrl: string;
}

export interface ISequence {
  sequenceId: number;
  sequenceName: string;
  sequenceAlternateName: string;
  poses: IPose[];
}

export interface ISession {
  sessionId: number;
  sessionName: string;
  sessionAlternateName: string | undefined;
  sequences: ISequence[] | undefined;
}