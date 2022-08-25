import { IS_ANDROID } from "../../utils/environment";
import { EDITOR_TO_SCHEDULE_FLUSH } from "../../utils/weak-maps";
import {
  createAndroidInputManager,
  CreateAndroidInputManagerOptions
} from "./android-input-manager";
import { useMutationObserver } from "../use-mutation-observer";
import { AngularEditor } from "../../plugins/angular-editor";

type UseAndroidInputManagerOptions = {
  node: HTMLElement;
} & Omit<
  CreateAndroidInputManagerOptions,
  "editor" | "onUserInput" | "receivedUserInput"
>;

const MUTATION_OBSERVER_CONFIG: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true
};

export function useAndroidInputManager(
  editor: AngularEditor,
  { node, ...options }: UseAndroidInputManagerOptions
) {
  if (!IS_ANDROID) {
    return null;
  }

  const inputManager = createAndroidInputManager({
    editor,
    ...options
  });

  useMutationObserver(
    node,
    inputManager.handleDomMutations,
    MUTATION_OBSERVER_CONFIG
  );

  EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush);
  inputManager.flush();

  return inputManager;
}
