import { 
  copyProperties, 
  getValue, 
  setProperty, 
  setValue 
} from "../common";
import {
  hidden_powerPower,
  hidden_powerType,
  hpIv,
  shiny,
} from "../common/pokemon";

const PARTY_SIZE: number = 6;

export function getBits(a: number, b: number, d: number): number {
  return (a >> b) & ((1 << d) - 1);
}

export function getMetaState(): string {
  const team_0_level: number = getValue('player.team.0.level')
  const outcome_flags: number = getValue('battle.other.outcome_flags')
  const battle_mode: string = getValue('battle.mode')
  const low_health_alarm: string = getValue('battle.other.low_health_alarm')
  const team_0_species: string = getValue('player.team.0.species')
  const player_battle_species: string = getValue('battle.player.active_pokemon.species')
  const state: string = getValue('meta.state')
  if (team_0_level == 0) {
    return 'No Pokemon'
  }
  else if (battle_mode == null) {
    return 'Overworld'
  }	
  else if (low_health_alarm == "Disabled" || outcome_flags > 0) {
    return 'From Battle'
  }
  else if (team_0_species == player_battle_species) {
    return 'Battle'
  }
  else if ((state == 'Overworld' || state == 'To Battle') && battle_mode != null) {
    return 'To Battle'
  }
  else {
    return 'Battle'
  }
}

export function getEncounterRate(): number {
  const time_of_day: string = getValue("time.current.time_of_day");
  const morning: number = getValue("overworld.encounter_rates.morning");
  const day: number = getValue("overworld.encounter_rates.day");
  const night: number = getValue("overworld.encounter_rates.night");
  const water: number = getValue("overworld.encounter_rates.water");
  const movement_state: string = getValue("overworld.movement_state");
  if (movement_state == "Surfing") {
    return water;
  }
  switch (time_of_day) {
    case "Morning":
      return morning;
    case "Day":
      return day;
    case "Night":
      return night;
    default:
      return 0;
  }
}

export function getBattleOutcome(): string | null {
  const outcome_flags: number = getValue('battle.other.outcome_flags')
  const state: string = getMetaState()
  switch (state) {
    case 'From Battle':
      switch (outcome_flags) {
        case 0:
        case 64:
        case 128:
        case 192:
          return 'Win'
        case 1:
        case 65:
        case 129:
        case 193:
          return 'Lose'
        case 2:
        case 66:
        case 130:
        case 194:
          return 'Flee'
        default:
          return null
      }
  }
  return null
}

function getPlayerPartyPosition(): number {
  const state: string = getMetaState()
  switch (state) {
    case 'Battle':
      return getValue('battle.player.party_position')
    case 'From Battle':
      return getValue('battle.player.party_position')
    default: {
      const team: number[] = [0, 1, 2, 3, 4, 5]
      for (let i = 0; i < team.length; i++) {
        if (getValue<number>(`player.team.${i}.stats.hp`) > 0) {
          return i
        }
      }
      return 0
    }
  }
}

export function postprocessor() {
  const state = getMetaState()
  setValue("meta.state", state);
  setValue("overworld.encounter_rate", getEncounterRate());
  setValue("battle.outcome", getBattleOutcome());
  
  //Set player.active_pokemon properties
  const party_position_overworld = getPlayerPartyPosition()
  const party_position_battle = getValue('battle.player.party_position')
  setValue('player.party_position', getPlayerPartyPosition())
  if (state === 'Battle') {
    copyProperties(`player.team.${party_position_battle}`, 'player.active_pokemon')
    copyProperties('battle.player.active_pokemon', 'player.active_pokemon')
  } else {
    setProperty('player.active_pokemon.modifiers.attack', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.defense', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.speed', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.special_attack', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.special_defense', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.accuracy', { address: null, value: 0 })
    setProperty('player.active_pokemon.modifiers.evasion', { address: null, value: 0 })

    setProperty('player.active_pokemon.volatile_status_conditions.confused', { address: null, value: false })
    setProperty('player.active_pokemon.volatile_status_conditions.toxic', { address: null, value: false })
    setProperty('player.active_pokemon.volatile_status_conditions.leech_seed', { address: null, value: false })
    setProperty('player.active_pokemon.volatile_status_conditions.curse', { address: null, value: false })
    setProperty('player.active_pokemon.volatile_status_conditions.in_love', { address: null, value: false })
    setProperty('player.active_pokemon.volatile_status_conditions.nightmare', { address: null, value: false })

    setProperty('player.active_pokemon.effects.protect', { address: null, value: false })
    setProperty('player.active_pokemon.effects.identified', { address: null, value: false })
    setProperty('player.active_pokemon.effects.perish', { address: null, value: false })
    setProperty('player.active_pokemon.effects.endure', { address: null, value: false })
    setProperty('player.active_pokemon.effects.rollout', { address: null, value: false })
    setProperty('player.active_pokemon.effects.curled', { address: null, value: false })
    setProperty('player.active_pokemon.effects.bide', { address: null, value: false })
    setProperty('player.active_pokemon.effects.rampage', { address: null, value: false })
    setProperty('player.active_pokemon.effects.in_loop', { address: null, value: false })
    setProperty('player.active_pokemon.effects.flinched', { address: null, value: false })
    setProperty('player.active_pokemon.effects.charged', { address: null, value: false })
    setProperty('player.active_pokemon.effects.underground', { address: null, value: false })
    setProperty('player.active_pokemon.effects.flying', { address: null, value: false })
    setProperty('player.active_pokemon.effects.bypass_accuracy', { address: null, value: false })
    setProperty('player.active_pokemon.effects.mist', { address: null, value: false })
    setProperty('player.active_pokemon.effects.focus_energy', { address: null, value: false })
    setProperty('player.active_pokemon.effects.substitute', { address: null, value: false })
    setProperty('player.active_pokemon.effects.recharge', { address: null, value: false })
    setProperty('player.active_pokemon.effects.rage', { address: null, value: false })
    setProperty('player.active_pokemon.effects.transformed', { address: null, value: false })
    setProperty('player.active_pokemon.effects.encored', { address: null, value: false })
    setProperty('player.active_pokemon.effects.lock_on', { address: null, value: false })
    setProperty('player.active_pokemon.effects.destiny_bond', { address: null, value: false })
    setProperty('player.active_pokemon.effects.cant_run', { address: null, value: false })

    setProperty('player.active_pokemon.counters.rollout', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.confuse', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.toxic', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.disable', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.encore', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.perish', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.fury_cutter', { address: null, value: 0 })
    setProperty('player.active_pokemon.counters.protect', { address: null, value: 0 })

    copyProperties(`player.team.${party_position_overworld}`, 'player.active_pokemon')
  }

  for (let index = 0; index < PARTY_SIZE; index++) {
    const ivs = {
      attack: getValue<number>(`player.team.${index}.ivs.attack`),
      defense: getValue<number>(`player.team.${index}.ivs.defense`),
      special: getValue<number>(`player.team.${index}.ivs.special`),
      speed: getValue<number>(`player.team.${index}.ivs.speed`),
    };

    setValue(`player.team.${index}.shiny`, shiny(ivs));
    setValue(`player.team.${index}.hidden_power.power`, hidden_powerPower(ivs));
    setValue(`player.team.${index}.hidden_power.type`, hidden_powerType(ivs));
    setValue(`player.team.${index}.ivs.hp`, hpIv(ivs));
  }
}
