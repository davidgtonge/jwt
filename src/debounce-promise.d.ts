declare module "debounce-promise" {
  function debounce<T extends (...args: never[]) => Promise<unknown>>(
    fn: T,
    wait?: number,
  ): T;
  export default debounce;
}
