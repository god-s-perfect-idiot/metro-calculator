<script>
  import Icon from '@iconify/svelte';
import { onMount } from 'svelte';

  let expression = '0';
  let result = null;
  let memory = 0;
  let angleMode = 'Deg'; // Deg, Rad, Grad

  let isLandscape = false;

  // Reactive statement to log expression changes
  $: {
    console.log('🔄 Expression changed:', expression, 'Type:', typeof expression, 'Result:', result);
  }

  onMount(() => {
    const checkOrientation = () => {
      isLandscape = window.innerWidth > window.innerHeight;
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  });

  function inputNumber(num) {
    console.log('inputNumber called with:', num, 'current expression:', expression, 'result:', result);
    if (result !== null) {
      // If we just calculated, start a new expression
      expression = num;
      result = null;
    } else if (expression === '0') {
      expression = num;
    } else {
      expression += num;
    }
    console.log('expression after inputNumber:', expression);
  }

  function inputDecimal() {
    if (result !== null) {
      expression = '0.';
      result = null;
    } else {
      // Check if the last number already has a decimal
      const parts = expression.split(/[\+\-\×÷xʸ]/);
      const lastPart = parts[parts.length - 1];
      if (!lastPart.includes('.')) {
        expression += '.';
      }
    }
  }

  function clear() {
    expression = '0';
    result = null;
  }

  function backspace() {
    if (result !== null) {
      expression = '0';
      result = null;
    } else if (expression.length > 1) {
      expression = expression.slice(0, -1);
    } else {
      expression = '0';
    }
  }

  function toggleSign() {
    if (result !== null) {
      expression = String(-result);
      result = null;
    } else {
      // Toggle sign of the last number in expression
      const parts = expression.split(/([\+\-\×÷xʸ])/);
      if (parts.length > 0) {
        const lastNum = parts[parts.length - 1];
        if (lastNum && lastNum !== '0') {
          const num = parseFloat(lastNum);
          if (!isNaN(num)) {
            parts[parts.length - 1] = String(-num);
            expression = parts.join('');
          }
        }
      }
    }
  }

  function percentage() {
    if (result !== null) {
      expression = String(result / 100);
      result = null;
    } else {
      const parts = expression.split(/([\+\-\×÷xʸ])/);
      const lastNum = parts[parts.length - 1];
      const num = parseFloat(lastNum);
      if (!isNaN(num)) {
        parts[parts.length - 1] = String(num / 100);
        expression = parts.join('');
      }
    }
  }

  function setOperation(op) {
    console.log('setOperation called with:', op, 'current expression:', expression, 'result:', result);
    if (result !== null) {
      // If we just calculated, use the result as the starting value
      expression = String(result) + op;
      result = null;
    } else {
      // Replace the last operation if there is one, or append
      const trimmed = expression.trim();
      if (trimmed.endsWith('+') || trimmed.endsWith('-') || trimmed.endsWith('×') || trimmed.endsWith('÷') || trimmed.endsWith('xʸ')) {
        expression = expression.slice(0, -1).trim() + op;
      } else {
        expression += op;
      }
    }
    console.log('expression after setOperation:', expression);
  }

  function equals() {
    try {
      // Replace display symbols with JavaScript operators
      let evalExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/xʸ/g, '**');
      
      // Evaluate the expression
      const calculated = Function('"use strict"; return (' + evalExpression + ')')();
      result = calculated;
      expression = String(calculated);
    } catch (error) {
      result = 'Error';
      expression = 'Error';
    }
  }

  // Scientific functions - these evaluate immediately and update the expression
  function sin() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    if (angleMode === 'Deg') value = value * Math.PI / 180;
    else if (angleMode === 'Grad') value = value * Math.PI / 200;
    const calcResult = Math.sin(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function cos() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    if (angleMode === 'Deg') value = value * Math.PI / 180;
    else if (angleMode === 'Grad') value = value * Math.PI / 200;
    const calcResult = Math.cos(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function tan() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    if (angleMode === 'Deg') value = value * Math.PI / 180;
    else if (angleMode === 'Grad') value = value * Math.PI / 200;
    const calcResult = Math.tan(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function ln() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    const calcResult = Math.log(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function log() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    const calcResult = Math.log10(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function powerOf10() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    const calcResult = Math.pow(10, value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function squareRoot() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    const calcResult = Math.sqrt(value);
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function square() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseFloat(lastNum);
    if (isNaN(value)) value = 0;
    const calcResult = value * value;
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function factorial() {
    const parts = expression.split(/([\+\-\×÷xʸ])/);
    const lastNum = parts[parts.length - 1];
    let value = parseInt(parseFloat(lastNum));
    if (isNaN(value)) value = 0;
    if (value < 0 || value > 170) {
      expression = 'Error';
      result = 'Error';
      return;
    }
    let calcResult = 1;
    for (let i = 2; i <= value; i++) {
      calcResult *= i;
    }
    parts[parts.length - 1] = String(calcResult);
    expression = parts.join('');
    result = null;
  }

  function pi() {
    if (result !== null || expression === '0') {
      expression = String(Math.PI);
      result = null;
    } else {
      const parts = expression.split(/([\+\-\×÷xʸ])/);
      parts[parts.length - 1] = String(Math.PI);
      expression = parts.join('');
    }
  }

  function setAngleMode(mode) {
    angleMode = mode;
  }

  // Memory functions
  function memoryClear() {
    memory = 0;
  }

  function memoryRecall() {
    expression = String(memory);
    result = null;
  }

  function memoryAdd() {
    const currentValue = result !== null ? result : parseFloat(expression) || 0;
    memory += currentValue;
  }

  // Reactive display text
  $: displayText = expression || '0';
  
  let displayElement;
  let userHasScrolled = false;
  let lastScrollLeft = 0;
  
  function handleScroll() {
    if (!displayElement) return;
    const currentScrollLeft = displayElement.scrollLeft;
    const maxScroll = displayElement.scrollWidth - displayElement.clientWidth;
    
    // Check if user is at or near the right end (within 10px)
    const isAtEnd = currentScrollLeft >= maxScroll - 10;
    
    // If user scrolled away from the end, mark that they've manually scrolled
    if (!isAtEnd && currentScrollLeft < lastScrollLeft) {
      userHasScrolled = true;
    }
    
    // If user scrolls back to the end, reset the flag
    if (isAtEnd) {
      userHasScrolled = false;
    }
    
    lastScrollLeft = currentScrollLeft;
  }
  
  function scrollToEndIfNeeded() {
    if (!displayElement) return;
    
    // Only auto-scroll if user hasn't manually scrolled away
    if (!userHasScrolled) {
      const maxScroll = displayElement.scrollWidth - displayElement.clientWidth;
      displayElement.scrollLeft = displayElement.scrollWidth;
    }
  }
  
  // Scroll to end when display text changes, but only if user is at the end
  $: if (displayText && displayElement) {
    setTimeout(scrollToEndIfNeeded, 0);
  }
</script>

<div class="calculator-container">
  <div class="display-area">
    <div class="result-display" bind:this={displayElement} on:scroll={handleScroll}>{displayText}</div>
  </div>

  {#if isLandscape}
    <!-- Scientific Calculator (Landscape) -->
    <div class="button-grid scientific">
      <!-- Row 1 -->
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]">(</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]">)</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={pi}>π</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={clear}>C</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={backspace}>
        <Icon icon="cil:backspace" width="40" height="40"/>
      </button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={toggleSign}>±</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={() => setOperation('÷')}>÷</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={percentage}>%</button>

      <!-- Row 2 -->
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e] {angleMode === 'Deg' ? 'active' : ''}" on:click={() => setAngleMode('Deg')}>Deg</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e] {angleMode === 'Rad' ? 'active' : ''}" on:click={() => setAngleMode('Rad')}>Rad</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e] {angleMode === 'Grad' ? 'active' : ''}" on:click={() => setAngleMode('Grad')}>Grad</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('7')}>7</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('8')}>8</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('9')}>9</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={() => setOperation('×')}>×</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={squareRoot}>√</button>

      <!-- Row 3 -->
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={sin}>sin</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={cos}>cos</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={tan}>tan</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('4')}>4</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('5')}>5</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('6')}>6</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={() => setOperation('-')}>−</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={memoryClear}>MC</button>

      <!-- Row 4 -->
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={ln}>ln</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={log}>log</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={powerOf10}>10ˣ</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('1')}>1</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('2')}>2</button>
      <button class="calc-btn !text-[2rem]" on:click={() => inputNumber('3')}>3</button>
      <button class="calc-btn !text-[3rem] !bg-[#2e2e2e]" on:click={() => setOperation('+')}>+</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={memoryRecall}>MR</button>

      <!-- Row 5 -->
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={factorial}>n!</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={square}>x²</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={() => setOperation('xʸ')}>xʸ</button>
      <button class="calc-btn !text-[2rem] zero-btn" on:click={() => inputNumber('0')}>0</button>
      <button class="calc-btn !text-[2rem]" on:click={inputDecimal}>,</button>
      <button class="calc-btn equals" on:click={equals}>=</button>
      <button class="calc-btn !text-[2rem] !bg-[#2e2e2e]" on:click={memoryAdd}>M+</button>
    </div>
  {:else}
    <!-- Basic Calculator (Portrait) -->
    <div class="button-grid basic">
      <!-- Row 1 -->
      <button class="calc-btn !bg-[#2e2e2e]" on:click={clear}>C</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={memoryClear}>MC</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={memoryRecall}>MR</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={memoryAdd}>M+</button>

      <!-- Row 2 -->
      <button class="calc-btn !bg-[#2e2e2e]" on:click={backspace}>
        <Icon icon="cil:backspace" />
      </button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={toggleSign}>±</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={percentage}>%</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={() => setOperation('÷')}>÷</button>

      <!-- Row 3 -->
      <button class="calc-btn" on:click={() => inputNumber('7')}>7</button>
      <button class="calc-btn" on:click={() => inputNumber('8')}>8</button>
      <button class="calc-btn" on:click={() => inputNumber('9')}>9</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={() => setOperation('×')}>×</button>

      <!-- Row 4 -->
      <button class="calc-btn" on:click={() => inputNumber('4')}>4</button>
      <button class="calc-btn" on:click={() => inputNumber('5')}>5</button>
      <button class="calc-btn" on:click={() => inputNumber('6')}>6</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={() => setOperation('-')}>−</button>

      <!-- Row 5 -->
      <button class="calc-btn" on:click={() => inputNumber('1')}>1</button>
      <button class="calc-btn" on:click={() => inputNumber('2')}>2</button>
      <button class="calc-btn" on:click={() => inputNumber('3')}>3</button>
      <button class="calc-btn !bg-[#2e2e2e]" on:click={() => setOperation('+')}>+</button>

      <!-- Row 6 -->
      <button class="calc-btn zero-btn" on:click={() => inputNumber('0')}>0</button>
      <button class="calc-btn" on:click={inputDecimal}>,</button>
      <button class="calc-btn equals" on:click={equals}>=</button>
    </div>
  {/if}
</div>

<style>
  .calculator-container {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
  }

  .display-area {
    flex: 0 0 35%;
    padding: 1rem 1.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }

  .result-display {
    font-size: 6rem;
    color: #ffffff;
    font-weight: 300;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: right;
    line-height: 1.1;
    width: 100%;
    max-width: 100%;
  }
  
  /* Use container query if supported, otherwise use JavaScript fallback */
  @supports (container-type: inline-size) {
    .display-area {
      container-type: inline-size;
    }
    
    .result-display {
      font-size: 6rem;
    }
  }

  .button-grid {
    flex: 1 1 auto;
    display: grid;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .button-grid.basic {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }

  .button-grid.scientific {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(5, minmax(0, 1fr));
  }

  .calc-btn {
    background-color: #212121;
    color: #ffffff;
    border: none;
    font-size: 2rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.1s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .calc-btn:active {
    background-color: #646464 !important;
  }

  .calc-btn.equals {
    background-color: #a4c400;
    color: #ffffff;
  }

  .calc-btn.equals:active {
    background-color: #1d7b1d !important;
  }

  .calc-btn.active {
    background-color: #646464 !important;
  }

  .calc-btn.zero-btn {
    grid-column: span 2;
  }

  .calc-btn svg {
    width: 20px;
    height: 20px;
  }

  @media (orientation: landscape) {
    .display-area {
      flex: 0 0 8rem;
      height: 8rem;
    }
    
    .button-grid {
      flex: 1 1 auto;
      height: calc(100vh - 8rem);
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }
  
</style>

