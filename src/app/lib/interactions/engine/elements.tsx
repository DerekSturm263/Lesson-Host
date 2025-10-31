'use client'

import { InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Type } from '@google/genai';
import { CSSProperties, JSX, PureComponent, useState } from 'react';
//import { GameEngine } from 'react-game-engine';
import * as helpers from '@/app/lib/helpers';

export type InteractionType = {
  properties: CSSProperties,
  entities: Entity[]
};

export type Entity = {
  id: string,
  transform: transform,
  properties: CSSProperties,
  renderer: PureComponent | undefined
};

export type transform = {
  position: vector2,
  rotation: number,
  scale: vector2
}

export type vector2 = {
  x: number,
  y: number
}

const defaultValue: InteractionType = {
  properties: { backgroundColor: "blue" },
  entities: [
    {
      id: "e1",
      transform: {
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      properties: { backgroundColor: "red" },
      renderer: undefined
    }
  ]
}

const schema = {
  type: Type.OBJECT,
  properties: {

  },
  required: [

  ],
  propertyOrdering: [

  ]
};

function Component(props: InteractionProps) {
  const [ properties, setProperties ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).properties);
  const [ entities, setEntities ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).entities);

  //const renderedEntities = entities.map(entity => ({ ...entity, renderer: Renderer }));

  return (
    <GameEngine
      style={{ ...properties, width: "100%", height: "100%" }}
      systems={[]}
      entities={entities}
    />
  );
}

/*function MoveEntity(entities, { input }) {
  const { payload } = input.find(x => x.name === "onMouseDown") || {};

  if (payload) {
    const box1 = entities["box1"];

    box1.x = payload.pageX;
    box1.y = payload.pageY;
  }

  return entities;
};

class Renderer extends PureComponent {
  render() {
    return (
      <div
        style={{ ...this.props.properties, position: "absolute", left: this.props.x, top: this.props.y }}
      />
    )
  }
}*/

const interaction: InteractionPackage = {
  id: "engine",
  prettyName: "Engine",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
