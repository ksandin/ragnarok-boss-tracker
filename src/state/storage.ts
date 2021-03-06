import { Hunt } from "./Hunt";
import { MapLocation } from "./MapLocation";
import { Mob } from "./Mob";
import { MapId } from "./MapId";
import { mapList } from "../fixtures/maps";
import { MobId } from "./MobId";

const storageId = "hunts";

export const saveToLocalStorage = (hunts: Hunt[]) => {
  const serialized: SerializedHunt[] = hunts.map((hunt) => ({
    mobId: hunt.mob.id,
    mapId: hunt.map.id,
    killTime: hunt.killTime ? hunt.killTime.toUTCString() : undefined,
    tombstoneLocation: hunt.tombstoneLocation,
  }));
  localStorage.setItem(storageId, JSON.stringify(serialized));
};

export const loadFromLocalStorage = (mobs: Mob[]): Hunt[] => {
  const json = localStorage.getItem(storageId);
  if (!json) {
    return [];
  }
  try {
    const serialized: SerializedHunt[] = JSON.parse(json);
    const hunts: Hunt[] = [];
    for (const { mobId, mapId, killTime, tombstoneLocation } of serialized) {
      const mob = mobs.find(
        (candidate) => candidate.id === mobId && candidate.map.id === mapId
      );
      const map = mapList.find((map) => map.id === mapId);
      if (mob) {
        hunts.push(
          new Hunt(
            mob,
            map,
            killTime ? new Date(killTime) : undefined,
            tombstoneLocation
          )
        );
      }
    }
    return hunts;
  } catch (e) {}
  return [];
};

type SerializedHunt = {
  mobId: MobId;
  killTime?: string;
  mapId: MapId;
  tombstoneLocation: MapLocation | undefined;
};
