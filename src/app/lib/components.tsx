'use client'

import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX } from 'react';
import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { verifyCodespace } from './generate';
import { saveSkill } from './database';
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

export function ChapterButton({ elementID, mode, removeChapter }: { elementID: types.ElementID, mode: types.ComponentMode, removeChapter: (index: number) => void }) {
  const [ title, setTitle ] = useState(helpers.getChapter(elementID).title);
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
          {title}
        </h4>
      ) : (
        <input
          type="text"
          name="chapterTitle"
          value={title}
          onInput={(e) => {
            setTitle(e.currentTarget.value)
            elementID.learn.chapters[elementID.chapterIndex].title = e.currentTarget.value;
          }}
        />
      ))}

      <Image
        id={`chapterCheckmark${elementID.chapterIndex}`}
        className="checkmark"
        src="/icons/checkmark.png"
        alt="Checkmark"
        data-iscomplete="false"
      />
      
      {mode == types.ComponentMode.Edit && (
        <button
          onClick={(e) => removeChapter(elementID.chapterIndex)}
        >
          Delete
        </button>
      )}
    </button>
  );
}

export function LearnPageContent({ slug, skill, mode, apiKey }: { slug: string, skill: types.Skill, mode: types.ComponentMode, apiKey: string }) {
  const [ chapters, setChapters ] = useState(skill.learn.chapters);

  function addChapter() {
    const newChapters = chapters;
    newChapters.push({
      title: "New Chapter",
      elements: [ {
        type: types.ElementType.ShortAnswer,
        text: "New element",
        value: { correctAnswer: "" },
        state: types.ElementState.Complete
      } ]
    });
    setChapters(newChapters);
  }

  function removeChapter(index: number) {
    const newChapters = chapters;
    chapters.splice(index, 1);
    setChapters(newChapters);
  }

  if (mode == types.ComponentMode.View) {
    for (let i = 0; i < chapters.length; ++i) {
      for (let j = 0; j < chapters[i].elements.length; ++j) {
        if (i != 0 || j != 0) {
          chapters[i].elements[j].state = types.ElementState.Locked;
        }
      }
    }
  }

  return (
    <div className="content">
      <Sidebar label="Chapters">
        {chapters.map((chapter, index) => (
          <ChapterButton
            key={index}
            elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ apiKey ] }}
            mode={mode}
            removeChapter={removeChapter}
          />
        ))}

        {mode == types.ComponentMode.Edit && (
          <button
            onClick={(e) => addChapter()}
          >
            New Chapter
          </button>
        )}

        {mode == types.ComponentMode.Edit && (
          <button
            onClick={(e) => saveSkill(slug, skill)}
          >
            Save
          </button>
        )}
      </Sidebar>

      <div className="elements">
        {chapters.map((chapter, cIndex) => (
          chapter.elements.map((element, eIndex) => (
            <Element
              key={`${cIndex}:${eIndex}`}
              elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ apiKey ] }}
              mode={mode}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function Interaction({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ type, setType ] = useState(helpers.getElement(elementID).type);
  const [ isDisabled, setIsDisabled ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

  function setTypeAndUpdate(type: types.ElementType) {
    setType(type);

    switch (type) {
      case types.ElementType.ShortAnswer:
        elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].value = {
          correctAnswer: ""
        };
        break;
        
      case types.ElementType.MultipleChoice:
        elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].value = {
          choices: [],
          type: types.MultipleChoiceType.Radio,
          needsAllCorrect: false
        };
        break;
        
        
    }
  }

  const typeSwitcher = (
    <label>
      Type:

      <select
        name="selectType"
        value={type}
        onChange={(e) => setTypeAndUpdate(e.currentTarget.value as types.ElementType)}
      >
        {(Object.values(types.ElementType).map((item, index) => (
          <option
            key={index}
            value={item}
          >
            {item}
          </option>
        )))}
      </select>
    </label>
  );

  let interaction: JSX.Element = <></>;

  switch (type) {
    case types.ElementType.ShortAnswer:
      interaction = <ShortAnswer elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.MultipleChoice:
      interaction = <MultipleChoice elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.TrueOrFalse:
      interaction = <TrueOrFalse elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Matching:
      interaction = <Matching elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Ordering:
      interaction = <Ordering elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Files:
      interaction = <Files elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Drawing:
      interaction = <Drawing elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Graph:
      interaction = <Graph elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.DAW:
      interaction = <DAW elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Codespace:
      interaction = <Codespace elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Engine:
      interaction = <Engine elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.IFrame:
      interaction = <IFrame elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;
  }

  return (
    <div
      className="interaction"
      data-type={type}
    >
      {mode == types.ComponentMode.Edit && typeSwitcher}

      {interaction}
    </div>
  )
}

function ShortAnswer({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
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

function MultipleChoice({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ type, setType ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).type);
  const [ needsAllCorrect, setNeedsAllCorrect ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).needsAllCorrect);

  return (
    <div
      className="smallInteraction"
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
        action={(e) => functions.submitMultipleChoice(e, elementID)}
      >
        {helpers.getInteractionValue<types.MultipleChoice>(elementID).choices.map((item, index) => (
          <MultipleChoiceItem
            key={index}
            elementID={elementID}
            isDisabled={isDisabled}
            mode={mode}
            item={item}
            index={index}
          />
        ))}

        {mode == types.ComponentMode.Edit && (
          <label>
            Type: 
            <select
              name="selectType"
              value={type}
              onChange={(e) => setType(e.currentTarget.value as types.MultipleChoiceType)}
            >
              {(Object.values(types.MultipleChoiceType).map((item, index) => (
                <option
                  key={index}
                  value={item}
                >
                  {item}
                </option>
              )))}
            </select>
          </label>
        )}
        
        {mode == types.ComponentMode.Edit && (
          <label>
            Needs All Correct: 

            <input
              type="checkbox"
              name="needsAllCorrect"
              id="needsAllCorrect"
              value={String(needsAllCorrect)}
              onInput={(e) => setNeedsAllCorrect(e.currentTarget.value == "true")}
            />
          </label>
        )}

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}

function MultipleChoiceItem({ elementID, isDisabled, mode, item, index }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode, item: types.MultipleChoiceItem, index: number }) {
  const [ choice, setChoice ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).choices[index]);

  return (
    <label>
      <input
        type={helpers.getInteractionValue<types.MultipleChoice>(elementID).type}
        name="response"
        id={item.value}
        value={item.isCorrect.toString()}
        disabled={isDisabled}
      />

      {(mode == types.ComponentMode.View ? (
        <Markdown>
          {item.value}
        </Markdown>
      ) : (
        <div>
          <label>
            Value:
            
            <input
              type="checkbox"
              name="responseIsCorrect"
              value={item.isCorrect.toString()}
              onInput={(e) => setChoice({ value: choice.value, isCorrect: e.currentTarget.value == "true" } )}
            />
          </label>
          
          <label>
            Is Correct: 
            
            <input
              type="text"
              name="responseValue"
              value={item.value}
              onInput={(e) => setChoice({ value: e.currentTarget.value, isCorrect: choice.isCorrect })}
            />
          </label>
        </div>
      ))}
    </label>
  );
}

function TrueOrFalse({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
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

function Matching({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Ordering({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Files({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Drawing({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Graph({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
      onLoad={(e) => functions.loadGraph(elementID)}
    ></div>
  );
}

function DAW({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Codespace({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ language, setLanguage ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).language);
  const [ content, setContent ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).content);
  const [ output, setOutput ] = useState("Press \"Run\" to execute your code. Any outputs or errors will be printed here");

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
        language: language,
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
      helpers.getInteractionValue<types.Codespace>(elementID).content = content ?? '';
    }
  }

  return (
    <div
      className="fullscreenInteraction"
    >
      <Editor
        defaultLanguage={language}
        defaultValue={content}
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

function Engine({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

function IFrame({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
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
  const [ elements, setElements ] = useState(helpers.getChapter(elementID).elements);

  useEffect(() => {
    window.addEventListener(`updateText${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setText((e as CustomEvent).detail);
    });
  }, []);

  function addElement() {
    const newElements = elements;
    newElements.push({
      type: types.ElementType.ShortAnswer,
      text: "New element",
      value: { correctAnswer: "" },
      state: types.ElementState.Complete
    });
    setElements(newElements);
  }

  function removeElement(index: number) {
    const newElements = elements;
    newElements.splice(index, 1);
    setElements(newElements);
  }

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
              },
              p({ node, children }) {
                return <WordWrapper text={String(children)} />
              },
              li({ node, children }) {
                return <li><WordWrapper text={String(children)} /></li>
              },
              code({ node, children }) {
                return <code><WordWrapper text={String(children)} /></code>
              }
            }}
          >
            {text}
          </Markdown>
        ) : (
          <input
            type="text"
            name="elementText"
            value={text}
            onInput={(e) => setText(e.currentTarget.value)}
          />
        ))}
      </div>

      <div className="buttons">
        <div className="col1">
          {elements.map((element, index) => (
            <Dot
              key={index}
              elementID={{ learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: index, keys: elementID.keys }}
            />
          ))}

          {mode == types.ComponentMode.Edit && (
            <button
              onClick={(e) => addElement()}
            >
              New
            </button>
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

        <div className="col2">
          {mode == types.ComponentMode.Edit && (
            <button
              onClick={(e) => removeElement(elementID.elementIndex)}
            >
              Delete
            </button>
          )}
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
