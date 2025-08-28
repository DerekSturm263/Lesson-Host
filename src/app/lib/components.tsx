'use client'

import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState } from 'react';
import { useEffect } from 'react';
import { verifyCodespace } from './generate';
import * as functions from '../lib/functions';
import * as types from '../lib/types';
import * as helpers from '../lib/helpers';

export function Header() {
  return (
    <div className="header">
      <h3>
        <Link
          href="/"
          target="_self"
        >
          MySkillStudy.com
        </Link>
      </h3>

      <ol>
        <Link
          href="/learn"
          target="_self"
          rel="noopener noreferrer"
        >
          Learn
        </Link>
          
        <Link
          href="/create"
          target="_self"
          rel="noopener noreferrer"
        >
          Create
        </Link>
      </ol>

      <select name="selectLanguage" id="selectLanguage">
        <option value="en">English</option>
        <option value="nl">Dutch</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="pl">Polish</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
        <option value="sv">Swedish</option>
      </select>
    </div>
  );
}

export function Sidebar({ children, label }: { children?: React.ReactNode, label: string }) {
  return (
    <div className="sidebar">
      <h3>
        {label}
      </h3>

      <ol>
        {Children.map(children, child => 
          <li>
            {child}
          </li>
        )}
      </ol>
    </div>
  );
}

export function Element({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      id={`element${helpers.getAbsoluteIndex(elementID)}`}
      className="element"
    >
      <Interaction elementID={elementID} />
      <Text elementID={elementID} />
    </div>
  );
}

export function ChapterButton({ elementID }: { elementID: types.ElementID }) {
  useEffect(() => {
    functions.load({ learn: elementID.learn, chapterIndex: 0, elementIndex: 0 });
  }, []);

  return (
    <button
      id={`chapterButton${elementID.chapterIndex}`}
      className='chapterButton'
      title={`Load chapter ${elementID.chapterIndex + 1}`}
      onClick={(e) => functions.load(elementID)}
      disabled={helpers.getElement(elementID).state == types.ElementState.Locked}
      data-iscomplete="false"
      data-isselected="false"
    >
      <h4>
        {helpers.getChapter(elementID).title}
      </h4>

      <Image
        id={`chapterCheckmark${elementID.chapterIndex}`}
        className="checkmark"
        src="/icons/checkmark.png"
        alt="Checkmark"
        data-iscomplete="false"
      />
    </button>
  );
}

function Interaction({ elementID }: { elementID: types.ElementID }) {
  switch (helpers.getElement(elementID).type) {
    case types.ElementType.ShortAnswer:
      return (<div className="interaction" data-type="shortAnswer"><ShortAnswer elementID={elementID} /></div>);
    case types.ElementType.MultipleChoice:
      return (<div className="interaction" data-type="multipleChoice"><MultipleChoice elementID={elementID} /></div>);
    case types.ElementType.TrueOrFalse:
      return (<div className="interaction" data-type="trueOrFalse"><TrueOrFalse elementID={elementID} /></div>);
    case types.ElementType.Matching:
      return (<div className="interaction" data-type="matching"><Matching elementID={elementID} /></div>);
    case types.ElementType.Ordering:
      return (<div className="interaction" data-type="ordering"><Ordering elementID={elementID} /></div>);
    case types.ElementType.Files:
      return (<div className="interaction" data-type="files"><Files elementID={elementID} /></div>);
    case types.ElementType.Drawing:
      return (<div className="interaction" data-type="drawing"><Drawing elementID={elementID} /></div>);
    case types.ElementType.Graph:
      return (<div className="interaction" data-type="graph"><Graph elementID={elementID} /></div>);
    case types.ElementType.DAW:
      return (<div className="interaction" data-type="daw"><DAW elementID={elementID} /></div>);
    case types.ElementType.Codespace:
      return (<div className="interaction" data-type="codespace"><Codespace elementID={elementID} /></div>);
    case types.ElementType.Engine:
      return (<div className="interaction" data-type="engine"><Engine elementID={elementID} /></div>);
    case types.ElementType.IFrame:
      return (<div className="interaction" data-type="iFrame"><IFrame elementID={elementID} /></div>);
    default:
      return <div className="interaction" data-type="none"></div>;
  }
}

function ShortAnswer({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      <form
        action={(e) => functions.submitShortAnswer(e, elementID)}
      >
        <input
          id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
          type="text"
          name="response"
          placeholder="Write your response here. Press enter to submit"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

function MultipleChoice({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        action={(e) => functions.submitMultipleChoice(e, elementID)}
      >
        {helpers.getInteractionValue<types.MultipleChoice>(elementID).choices.map((item, index) => (
          <label
            key={index}
          >
            {item.value}

            <input
              type={helpers.getInteractionValue<types.MultipleChoice>(elementID).needsAllCorrect ? 'radio' : 'checkbox'}
              name="response"
              id={item.value}
              value={item.isCorrect.toString()}
            />
          </label>
        ))}

        <label>
          Submit

          <input
            type="submit"
            name="submit"
          />
        </label>
      </form>
    </div>
  );
}

function TrueOrFalse({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        action={(e) => functions.submitTrueOrFalse(e, elementID)}
      >
        <label>
          True
        
          <input
            type="radio"
            name="response"
            id="true"
            value="true"
          />
        </label>

        <label>
          False
        
          <input
            type="radio"
            name="response"
            id="false"
            value="false"
          />
        </label>

        <label>
          Submit

          <input
            type="submit"
            name="submit"
          />
        </label>
      </form>
    </div>
  );
}

function Matching({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Ordering({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Files({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Drawing({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Graph({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="fullscreenInteraction"
      onLoad={(e) => functions.loadGraph(elementID)}
    ></div>
  );
}

function DAW({ elementID }: { elementID: types.ElementID }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Codespace({ elementID }: { elementID: types.ElementID }) {
  const [ element, setElement ] = useState(elementID);

  useEffect(() => {
    window.addEventListener(`updateInteraction${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setElement((e as CustomEvent).detail);
    });

    window.onmessage = async function(e) {
      console.log(e);

      if (!e.data)
        return;

      if (e.data.action == 'runStart') {
        helpers.startThinking(element);
      } else if (e.data.action == 'runComplete') {
        const feedback = await verifyCodespace(helpers.getElement(element).text, e.data.files, e.data.result, helpers.getInteractionValue<types.Codespace>(element).correctOutput ?? '', e.data.language);
        helpers.setText(element, feedback.feedback);

        functions.readAloud(element);
    
        if (feedback.isValid) {
          functions.complete(element);
        }
      }
    }
  }, []);

  return (
    <iframe
      id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
      className="fullscreenInteraction"
      onLoad={(e) => functions.loadCodespace(elementID)}
      src={`https://onecompiler.com/embed/${helpers.getInteractionValue<types.Codespace>(elementID).language}?availableLanguages=true&hideLanguageSelection=true&hideNew=true&hideNewFileOption=true&hideTitle=true&theme=dark&listenToEvents=true&codeChangeEvent=true`}
    ></iframe>
  );
}

function Engine({ elementID }: { elementID: types.ElementID }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

function IFrame({ elementID }: { elementID: types.ElementID }) {
  return (
    <iframe
      id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
      className="fullscreenInteraction"
      src={helpers.getInteractionValue<types.IFrame>(elementID).source}
    ></iframe>
  );
}

function Text({ elementID }: { elementID: types.ElementID }) {
  const [ text, setText ] = useState(helpers.getElement(elementID).text);

  useEffect(() => {
    window.addEventListener(`updateText${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setText((e as CustomEvent).detail);
    });
  }, []);

  return (
    <div className="textBox">
      <div
        id={`text${helpers.getAbsoluteIndex(elementID)}`}
        data-lastnonthinkingtext={helpers.getElement(elementID).text}
        className="text"
      >
        <WordWrapper>
          <Markdown>{text}</Markdown>
        </WordWrapper>
      </div>

      <div className="buttons">
        <div className="col1">
          {helpers.getChapter(elementID).elements.map((element, index) => {
            const eID = { learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: index };
          
            return (
              <button
                className={`dot dot${helpers.getAbsoluteIndex(eID)}`}
                key={index}
                onClick={(e) => functions.load(eID)}
                title={`Load section ${index + 1}`}
                disabled={element.state == types.ElementState.Locked}
                data-iscomplete="false"
                data-isselected="false"
              ></button>
            )
          })}
        </div>

        <div className="col2">
          <button
            onClick={(e) => functions.rephrase(elementID)}
            title="Rephrase text"
          >
            <Image
              src="/icons/sparkle.png"
              width={25}
              height={25}
              alt="Rephrase"
            />
            Rephrase
          </button>
          
          <button
            onClick={(e) => functions.readAloud(elementID)}
            title="Read text aloud"
          >
            <Image
              src="/icons/speaker.png"
              width={25}
              height={25}
              alt="Read Aloud"
            />
            Read Aloud
          </button>

          <button
            onClick={(e) => functions.reset(elementID)}
            title="Reset text and interaction"
          >
            <Image
              src="/icons/refresh.png"
              width={25}
              height={25}
              alt="Reset"
            />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function WordWrapper({ children }: { children?: React.ReactNode }) {
  const wordIndex = useRef(0);

  const wrapWords = (node: ReactNode): ReactNode => {
    if (typeof node === "string") {
      return node
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => {
          const index = wordIndex.current++;
          return (
            <Fragment key={index}>
              <span
                className="word"
                onDoubleClick={(e) => functions.define(word)}
                title="Double click to define this word"
                style={{"--index": `${index / 8}s`} as React.CSSProperties}
              >
                {word}
              </span>{" "}
            </Fragment>
          );
        });
    }

    /*if (isValidElement(node)) {
      return cloneElement(node, {
        children: Children.map(node.props.children, wrapWords)
      });
    }*/

    return node;
  };

  return <>{Children.map(children, wrapWords)}</>;
}
