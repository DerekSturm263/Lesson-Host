'use client'

import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement } from 'react';
import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { verifyCodespace } from './generate';
import * as functions from '../lib/functions';
import * as types from '../lib/types';
import * as helpers from '../lib/helpers';
import ky from 'ky';

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

export function Element({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      id={`element${helpers.getAbsoluteIndex(elementID)}`}
      className="element"
    >
      <Interaction elementID={elementID} mode={mode} />
      <Text elementID={elementID} mode={mode} />
    </div>
  );
}

export function ChapterButton({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ state, setState ] = useState(helpers.getElement(elementID).state);

  useEffect(() => {
    functions.load({ learn: elementID.learn, chapterIndex: 0, elementIndex: 0, keys: elementID.keys });

    window.addEventListener(`updateChapter${elementID.chapterIndex}`, (e: Event) => {
      setState((e as CustomEvent).detail);
    });
  }, []);

  return (
    <button
      id={`chapterButton${elementID.chapterIndex}`}
      className='chapterButton'
      title={`Load chapter ${elementID.chapterIndex + 1}`}
      onClick={(e) => functions.load(elementID)}
      disabled={state == types.ElementState.Locked}
      data-iscomplete="false"
      data-isselected="false"
    >
      
      {(mode == types.ComponentMode.View ? (
        <h4>
          {helpers.getChapter(elementID).title}
        </h4>
      ) : (
        <form
          action={(e) => { elementID.learn.chapters[elementID.chapterIndex].title = e.get('chapterTitle')?.toString() ?? '' }}
        >
          <input
            type="text"
            name="chapterTitle"
            value={helpers.getChapter(elementID).title}
          />
        </form>
      ))}

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

function Interaction({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  switch (helpers.getElement(elementID).type) {
    case types.ElementType.ShortAnswer:
      return (<div className="interaction" data-type="shortAnswer"><ShortAnswer elementID={elementID} mode={mode} /></div>);
    case types.ElementType.MultipleChoice:
      return (<div className="interaction" data-type="multipleChoice"><MultipleChoice elementID={elementID} mode={mode} /></div>);
    case types.ElementType.TrueOrFalse:
      return (<div className="interaction" data-type="trueOrFalse"><TrueOrFalse elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Matching:
      return (<div className="interaction" data-type="matching"><Matching elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Ordering:
      return (<div className="interaction" data-type="ordering"><Ordering elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Files:
      return (<div className="interaction" data-type="files"><Files elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Drawing:
      return (<div className="interaction" data-type="drawing"><Drawing elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Graph:
      return (<div className="interaction" data-type="graph"><Graph elementID={elementID} mode={mode} /></div>);
    case types.ElementType.DAW:
      return (<div className="interaction" data-type="daw"><DAW elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Codespace:
      return (<div className="interaction" data-type="codespace"><Codespace elementID={elementID} mode={mode} /></div>);
    case types.ElementType.Engine:
      return (<div className="interaction" data-type="engine"><Engine elementID={elementID} mode={mode} /></div>);
    case types.ElementType.IFrame:
      return (<div className="interaction" data-type="iFrame"><IFrame elementID={elementID} mode={mode} /></div>);
    default:
      return <div className="interaction" data-type="none"></div>;
  }
}

function ShortAnswer({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ isDisabled, setIsDisabled ] = useState(true);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

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
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}

function MultipleChoice({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ isDisabled, setIsDisabled ] = useState(true);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

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
            <input
              type={helpers.getInteractionValue<types.MultipleChoice>(elementID).type}
              name="response"
              id={item.value}
              value={item.isCorrect.toString()}
              disabled={isDisabled}
            />

            {item.value}
          </label>
        ))}

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}

function TrueOrFalse({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ isDisabled, setIsDisabled ] = useState(true);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

  return (
    <div
      className="smallInteraction"
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        action={(e) => functions.submitTrueOrFalse(e, elementID)}
      >
        <label>
          <input
            type="radio"
            name="response"
            id="true"
            value="true"
            disabled={isDisabled}
          />

          True
        </label>

        <label>
          <input
            type="radio"
            name="response"
            id="false"
            value="false"
            disabled={isDisabled}
          />

          False
        </label>

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}

function Matching({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Ordering({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Files({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Drawing({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Graph({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
      onLoad={(e) => functions.loadGraph(elementID)}
    ></div>
  );
}

function DAW({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Codespace({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ output, setOutput ] = useState("Press \"Run\" to execute your code. Any outputs or errors will be printed here");
  const [ content, setContent ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).content);

  async function executeCode() {
    setOutput("Running...");
    helpers.startThinking(elementID);

    const response = await ky.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
      headers: {
        'x-rapidapi-key': elementID.keys[0],
        'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      json: {
        language: helpers.getInteractionValue<types.Codespace>(elementID).language,
        stdin: "",
        files: [
          {
            name: "code.cs",
            content: content
          }
        ]
      }
    }).json() as types.CodeResult;

    const output = `${response.stdout ?? ''}\n${response.stderr ?? ''}`;
    setOutput(output.trim() == '' ? 'Program did not output anything' : output);

    const feedback = await verifyCodespace(helpers.getElement(elementID).text, content, response, helpers.getInteractionValue<types.Codespace>(elementID));
    helpers.setText(elementID, feedback.feedback);

    functions.readAloud(elementID);

    if (feedback.isValid) {
      functions.complete(elementID);
    }
  }

  function updateContent(content: string | undefined) {
    setContent(content ?? '');

    if (mode == types.ComponentMode.Edit) {
      // TODO: Add language toggle and test.
      helpers.getInteractionValue<types.Codespace>(elementID).content = content ?? '';
    }
  }

  return (
    <div
      className="fullscreenInteraction"
    >
      <Editor
        defaultLanguage={helpers.getInteractionValue<types.Codespace>(elementID).language}
        defaultValue={helpers.getInteractionValue<types.Codespace>(elementID).content}
        theme="vs-dark"
        onChange={updateContent}
        width="60%"
        height="100%"
      />
      <div
        className="codeEditorRight"
      >
        <p>
          {output}
        </p>

        <button
          onClick={executeCode}
        >
          Run
        </button>
      </div>
    </div>
  );
}

function Engine({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

function IFrame({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <iframe
      id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
      className="fullscreenInteraction"
      src={helpers.getInteractionValue<types.IFrame>(elementID).source}
    ></iframe>
  );
}

let globalIndex = 0;

function Text({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ text, setText ] = useState(helpers.getElement(elementID).text);

  useEffect(() => {
    window.addEventListener(`updateText${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setText((e as CustomEvent).detail);
    });
  }, []);

  globalIndex = 0;

  return (
    <div className="textBox">
      <div
        id={`text${helpers.getAbsoluteIndex(elementID)}`}
        data-lastnonthinkingtext={helpers.getElement(elementID).text}
        className="text"
      >
        {(mode == types.ComponentMode.View ? (
          <Markdown
            components={{
              strong({ node, children }) {
                return <strong><WordWrapper text={String(children)} /></strong>
              },
              i({ node, children }) {
                return <i><WordWrapper text={String(children)} /></i>
              }
            }}
          >
            {text}
          </Markdown>
        ) : (
          <form
            action={(e) => { elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].text = e.get('elementText')?.toString() ?? '' }}
          >
            <input
              type="text"
              name="elementText"
              value={text}
            />
          </form>
        ))}
      </div>

      <div className="buttons">
        <div className="col1">
          {helpers.getChapter(elementID).elements.map((element, index) => (
            <Dot
              key={index}
              elementID={{ learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: index, keys: elementID.keys }}
            />
          ))}

          {mode == types.ComponentMode.Edit && (
            <button
              onClick={(e) => elementID.learn.chapters[elementID.chapterIndex].elements.push({
                type: types.ElementType.ShortAnswer,
                text: "New element",
                value: { correctAnswer: "" },
                state: types.ElementState.Complete
              })}
            />
          )}
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

function WordWrapper({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <span
          key={i}
          className="word"
          onDoubleClick={(e) => functions.define(word)}
          title="Double click to define this word"
          style={{"--index": `${globalIndex++ / 8}s`} as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </>
  );
}

function Dot({ elementID }: { elementID: types.ElementID }) {
  const [ dot, setDot ] = useState(helpers.getElement(elementID).state);

  useEffect(() => {
    window.addEventListener(`updateDots${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setDot((e as CustomEvent).detail);
    });
  }, []);

  return (
    <button
      className={`dot dot${helpers.getAbsoluteIndex(elementID)}`}
      onClick={(e) => functions.load(elementID)}
      title={`Load section ${elementID.elementIndex + 1}`}
      disabled={dot == types.ElementState.Locked}
      data-iscomplete="false"
      data-isselected="false"
    ></button>
  );
}
