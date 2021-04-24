import React, {Component} from 'react';
import './App.css';
import penguinJson from "./assets/penguin.json";
import DnD from "./components/DnD";
import InputSlider from './components/Slider';
import {Chart} from "react-google-charts";
import Timer from "./components/Timer";

const colors = ["red", "orange", "green", "blue", "purple"];

class App extends Component{

  constructor(){
    super();
    this.state={
      Ex2: [0, 'none', 'go'],
      Ex3: [0, 'none', 'go'],
      Ex4: [0, 'none', 'go'],
      Ex5: [0, 'none', 'go'],
      Ex6: [0, 'none', 'go'],
      red: 5,
      orange: 5,
      green: 5,
      blue: 5,
      purple: 5,
      genPenguin: [],
      redCount: 0,
      orangeCount: 0,
      greenCount: 0,
      blueCount: 0,
      purpleCount: 0,
      total: 0,
    }
    this._countPurple = this._countPurple.bind(this);
    this._createPenguin = this._createPenguin.bind(this);
    this._setColor = this._setColor.bind(this);
    this._trendOverTime = this._trendOverTime.bind(this);
    this._timerEnd = this._timerEnd.bind(this);
  }
  _done(exercise){
    if (exercise !== 1){
      let ex = "Ex" + exercise
      let change = this.state[ex];
      change[2] = 'stop'
      this.setState({
        [ex]: change
      });
    }
  }
  _timerEnd(exercise){
    // console.log("Timer" + exercise + "has ended");
    if (exercise !== 1){
      let ex = "Ex" + exercise
      let change = this.state[ex];
      change[1] = '5px solid #BC0F0F'
      this.setState({
        [ex]: change
      });
    }
  }
  _trendOverTime(iterations){
    let counts = [0,0,0,0,0]
    let penguin = [];
    let result = [];
    if(iterations === 1){
      result = this._createPenguin(counts);
        penguin = result[0];
        this.setState({
          genPenguin: penguin,
        });
    }
    else{
      this.setState({
        redCount: 0,
        orangeCount: 0,
        greenCount: 0,
        blueCount: 0,
        purpleCount: 0,
      });
      
      for(var i = 0; i < iterations; i++){
        result = this._createPenguin(counts);
        counts = result[1];
      }
      console.log("counts: " + counts);
      this.setState({
        redCount: 100*(counts[0]/5000),
        orangeCount: 100*(counts[1]/5000),
        greenCount: 100*(counts[2]/5000),
        blueCount: 100*(counts[3]/5000),
        purpleCount: 100*(counts[4]/5000)
      });
    }
  }

  _createPenguin(counts){
    let penguin = [];
    let total = parseInt(this.state.red) + parseInt(this.state.orange) + 
                parseInt(this.state.green) + parseInt(this.state.blue) + parseInt(this.state.purple);
    let red = parseInt(this.state.red);
    let orange = parseInt(this.state.orange) + red;
    let green = parseInt(this.state.green) + orange;
    let blue = parseInt(this.state.blue) + green;

    this.setState({
      total: total
    })

    let redCount = counts[0];
    let orangeCount = counts[1];
    let greenCount = counts[2];
    let blueCount = counts[3];
    let purpleCount = counts[4];

    for(var i = 0; i < 5; i++){
      let rand = Math.floor(Math.random() * total) + 1;
      if (rand <= red){
        penguin.push(penguinJson.red_penguin[i]);
        redCount += 1;
      }
      else if(rand <= orange){
        penguin.push(penguinJson.orange_penguin[i]);
        orangeCount += 1;
      }
      else if(rand <= green){
        penguin.push(penguinJson.green_penguin[i]);
        greenCount += 1;
      }
      else if(rand <= blue){
        penguin.push(penguinJson.blue_penguin[i]);
        blueCount += 1;
      }
      else{
        penguin.push(penguinJson.purple_penguin[i]);
        purpleCount += 1;
      }
      // console.log("random: " + rand);
    }
    counts = [redCount, orangeCount, greenCount, blueCount, purpleCount];
    return [penguin, counts]; 
  }

  _setColor(color, value){
    // console.log(color + ": " + value)
    this.setState({
      [color]: value
    });
  }

  _countPurple(count, exercise){
    if (exercise !== 1){
      console.log(exercise + ": " + count);
      let ex = "Ex" + exercise
      let change = this.state[ex];
      change[0] = count
      this.setState({
        [ex]: change
      });
    }
  }

  render(){
    const genPenguin = this.state.genPenguin.map(piece =>{
      return(
        <div className="image-container">
          <img src={piece.content} alt="piece"/>
        </div>
      )
    });
    const colorAdjusters = colors.map(color =>{
      return(
        <div className="slider" style={{width: 200}}>
          <InputSlider name={color} setColor={(value) => this._setColor(color, value)}/>
        </div>
      )
    });
      return (
        <div className="App">
          
          <h1> Explaining Data Bias with Penguins </h1>
          <div id="Background">
            <h2>Background</h2>
            <h3>Data and AI - some vocabulary</h3>
            <p><span style={{textDecoration: "underline"}}>Artificial intelligence (AI)</span>: the theory and development of computer systems able to perform tasks that normally require human intelligence, 
            such as visual perception, speech recognition, decision-making, and translation between languages. (Google)</p>
            <p><span style={{textDecoration: "underline"}}>Algorithm</span>: a process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer. (Google)</p>
            <p><span style={{textDecoration: "underline"}}>Data</span>: facts and statistics collected together for reference or analysis. (Google)</p>
            <p>Here, we will focus on image generation AI, or algorithms which generate new images from an existing set of data. 
              For our purposes, when we refer to "data" we mean a collection of images. 
            </p>
            <h3>How can data be biased?</h3>
            <p>There are two ways that data can be biased:</p>
              <p>1. Data does not include variables that properly capture the phenomenon we want to predict.</p>
              <p>2. Data includes content produced by humans which may contain bias against groups of people. (Krishnamurthy).</p>
              <p>We will focus on the second instance, which results from the integration of a biased dataset. 
                Image generation algorithms provide a visual example of how data bias influences real-world products. 
                One such algorithm was made famous by its output of a cropped image of
                Congresswoman Alexandria Ocasio-Cortez in an auto-generated bikini. The algorithm completed the image in this
                way because it was trained using internet data and the internet has been flooded with images of
                women in sexualized contexts. Thus the bias of the online community and our society as a whole
                is now being reflected in these algorithms. (Hao).</p>
          </div>
          <div id="Set_Up">
            <h2>Set Up</h2>
            <p>In this exercise, you will take the role of the AI. 
              AI operate on given data according to a set of rules. 
              Here are your rules: </p>
              <p>1. Follow the instructions for each activity</p>
              <p>2. Only use the images you are given to construct your product</p>
          </div>
          <div id="Exercise_1">
            <h2>Exercise 1</h2>
            <p className="instruction">To the left, you see a collection of shapes. 
              Your first task is to drag and drop shapes from the left to the right 
              to create a penguin. When your penguin is done, the box will turn green!
              Begin!
            </p>
            <DnD countPurple={(count) => this._countPurple(count, 1)} data={penguinJson.black_penguin} border='none' done={() => this._done(1)}/>
          </div>
          <div id="Exercise_2" className="instruction">
            <h2>Exercise 2</h2>
            <p> Great! Now that you've got a hang of the drag and drop, use these images to construct another penguin</p>
            <p>Hint 1: You will not need to use all of the data provided.</p>
            <p>Hint 2: If you want to amp up the pressure, use the timer below to see how fast you can build the penguin. 
              If you run out of time before you're done, the boxes will turn red!
            </p>
            <div id="box">
              <Timer end={() => this._timerEnd(2)} stop={this.state.Ex2[2]}/>
              <DnD countPurple={(count) => this._countPurple(count, 2)} data={penguinJson.ex2_Items} border={this.state.Ex2[1]} done={() => this._done(2)}/>
            </div>
          </div>
          <div id="Exercise_3">
            <h2>Exercise 3</h2>
            <p className="instruction">Wow! You're really good at this. In this next dataset, you will have even more colors to choose 
              from!
              Drag and drop images to construct another penguin:
            </p>
            <Timer end={() => this._timerEnd(3)} stop={this.state.Ex3[2]}/>
            <DnD countPurple={(count) => this._countPurple(count, 3)} data={penguinJson.ex3_Items} border={this.state.Ex3[1]} done={() => this._done(3)}/>
          </div>
          <div id="Check_In">
            <h2>Check In</h2>
            <p className="instruction">As you keep playing the game, your datasets will continue to change, but your task is the same every time, 
              just keep building those penguins!
            </p>
          </div>
          <div id="Exercise_4">
            <h2>Exercise 4</h2>
            <p className="instruction">Drag and drop images to construct a penguin:
            </p>
            <Timer end={() => this._timerEnd(4)} stop={this.state.Ex4[2]}/>
            <DnD countPurple={(count) => this._countPurple(count, 4)} data={penguinJson.ex4_Items} border={this.state.Ex4[1]} done={() => this._done(4)}/>
          </div>
          <div id="Exercise_5">
            <h2>Exercise 5</h2>
            <p className="instruction">Drag and drop images to construct a penguin:</p>
            <Timer end={() => this._timerEnd(5)} stop={this.state.Ex5[2]}/>
            <DnD countPurple={(count) => this._countPurple(count, 5)} data={penguinJson.ex5_Items} border={this.state.Ex5[1]} done={() => this._done(5)}/>
          </div>
          <div id="Exercise_6">
            <h2>Exercise 6</h2>
            <p className="instruction">Drag and drop images to construct a penguin:</p>
            <Timer end={() => this._timerEnd(6)} stop={this.state.Ex6[2]}/>
            <DnD countPurple={(count) => this._countPurple(count, 6)} data={penguinJson.ex6_Items} border={this.state.Ex6[1]} done={() => this._done(6)}/>
          </div>
          <div id="Check_In" className="instruction">
            <h2>Check In</h2>
            <p>Can you guess what changed between the datasets? If you guessed that we added more and more purple penguins, then you're correct!</p>
              <p>Now, lets take a look at your penguins: </p>
              <table>
                <tr>
                  <th>Exercise</th>
                  <th>Dataset</th>
                  <th>Your Penguin</th>
                </tr>
                <tr>
                  <td>3</td>
                  <td>{100*(1/5)}% purple pieces</td>
                  <td>{100*(this.state.Ex3[0]/5)}%  purple pieces</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>33.3% purple pieces</td>
                  <td>{100*(this.state.Ex4[0]/5)}%  purple pieces</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>{100*(1/2)}% purple pieces</td>
                  <td>{100*(this.state.Ex5[0]/5)}% purple pieces</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>66.6% purple pieces</td>
                  <td>{100*(this.state.Ex6[0]/5)}% purple pieces</td>
                </tr>
              </table>
              <div id="chart" style={{display: 'inline-block', backgroundColor: 'lightgray', padding: '16px', margin: 16}}>
                    <Chart
                      width={'500px'}
                      height={'300px'}
                      chartType="ColumnChart"
                      loader={<div>Loading Chart</div>}
                      data={[
                        ['Exercise', 'Data', 'Your Penguins'],
                        ['3', 100*(1/5), 100*(this.state.Ex3[0]/5)],
                        ['4', 100*(1/3), 100*(this.state.Ex4[0]/5)],
                        ['5', 100*(1/2), 100*(this.state.Ex5[0]/5)],
                        ['6', 100*(2/3), 100*(this.state.Ex6[0]/5)],
                      ]}
                      options={{
                        // Material design options
                        title: 'How Purple Are Your Penguins?',
                        chartArea: { width: '50%' },
                        colors: ['#3466CB', '#800180'],
                        hAxis: {
                          title: 'Exercise',
                        },
                        vAxis: {
                          title: 'Distribution (%)',
                          viewWindow: {
                            min: 0,
                            max: 100
                          }
                        },
                      }}
                      // For tests
                      legendToggle
                    />
                    </div>
            <p>Did your penguins follow the pattern in the data and include more and more purple pieces?</p>
            <p>If yes, you've played the game just like an AI!</p>
            <p>If not, that's alright! You may have added some human capabilities that the AI would not have.
              For example you may have made choices like including more of your favorite color, making your penguin all one color, and/or trying not to include
              certain colors. 
            </p>
            <p>Lets get rid of those biases and try something a little more random!</p>
          </div>
          <div className="instruction" id="Exercise_7">
            <h2>Exercise 7</h2>
            <p>This exercise is going to be a little different.</p>
            <p>Instead of picking from the data to build the penguin, your job will now be to curate the data!</p>
            <p>Use the tools bellow to change the amount of each color present in the dataset, 
              then press the "create penguin" button and we will build a random penguin from the dataset you created!
              Feel free to try multiple datasets, and/or keep hitting the button to see how the penguins will change. 
            </p>
            <div id="data_tool" style={{backgroundColor: 'lightgrey', padding: 16, display: "flex", justifyContent:"space-evenly"}}>
              <div id="selections">
                {colorAdjusters}
                <button type="button" onClick={() => this._trendOverTime(1)}>Create Penguin</button>
              </div>
              <div id="penguin" style={{width: 400, height: 280, backgroundColor: "grey", padding: 4}}>
                {genPenguin}
              </div>
            </div>
            <div id="overTime" style={{backgroundColor: 'lightgrey', color: 'black', padding: "16px"}}>
                <p>Now that you've generated a random penguin from your dataset, select the "Create 1000 Penguins!" button below 
                  to see the distribution of each color that results from generating 1000 penguins from your dataset!
                </p>
                <button type="button" onClick={() => this._trendOverTime(1000)}>Create 1000 Penguins!</button>
                
                <div style={{padding: "16px"}}>
                  <p>Just like before, feel free to change your dataset and hit the button again to see how the distributions change!
                    Note: When you change your dataset, the chart will update the data bars immediately but you have to hit the "Create 1000 Penguins!"
                    button again to see how that change will influence the penguins.
                  </p>
                  <div id="chart" style={{display: 'inline-block', margin: '0 auto'}}>
                    <Chart
                      width={'500px'}
                      height={'300px'}
                      chartType="ColumnChart"
                      loader={<div>Loading Chart</div>}
                      data={[
                        ['Color', 'Data', 'Penguins', {role: 'style'}],
                        ['red', 100*(this.state.red/this.state.total), this.state.redCount, '#FF0102'],
                        ['orange', 100*(this.state.orange/this.state.total), this.state.orangeCount, '#FFA500'],
                        ['green', 100*(this.state.green/this.state.total), this.state.greenCount, '#048004'],
                        ['blue', 100*(this.state.blue/this.state.total), this.state.blueCount, '#1601FE'],
                        ['purple', 100*(this.state.purple/this.state.total), this.state.purpleCount, '#800180']
                      ]}
                      options={{
                        // Material design options
                        title: 'Color Trend Over 1000 Iterations',
                        chartArea: { width: '50%' },
                        hAxis: {
                          title: 'Color',
                        },
                        vAxis: {
                          title: 'Distribution (%)',
                          viewWindow: {
                            min: 0,
                            max: 100
                          }
                        },
                      }}
                      // For tests
                      legendToggle
                    />
                    </div>
                    <p>In this graph, you can see the percentage of each color present in the set of all 1000 penguins.
                      For example, if the red bar has a height of 20, that means 20% of all the pieces used to make all 1000 penguins were red!
                      the blue bar next to each colored bar shows the percentage of the data that is occupied by that color. You can see that the blue bar
                      and the colored bar are almost exactly the same size every time. This is showing us that the distributions within the dataset are reflected almost
                      exactly in the products!
                    </p>
                </div>
            </div>

          </div>
          <div id="Explanation">
            <h2>Explanation</h2>
            <p>So what does this mean? The product models the data -- As you increase the amount of one color's presence in the dataset, 
              the likelihood of that color appearing in the penguin increases with it. The same happens with AI trained on internet data. 
              The higher the presence of innapropriate, sexualized, or misogynistic images in the dataset, the more likely it is that the generated image
              will also include such content. The AI is not purposefully creating offensive images, just as we are not purposefully creating purple penguins. 
              But when the data becomes so oversaturated with certain kinds of content, it becomes impossible for that content not to be reflected in the product.
            </p>
            <p>This is one reason why it is so important to take care when selecting data.</p>
          </div>
          <div id="WorksCited">
            <h2>Works Cited</h2>
            <p>
            Krishnamurthy, Prabhakar. "Understanding Data Bias." towards data science, edited by Ludovic
              Benistant, Medium, 11 Sept. 2019,
              https://towardsdatascience.com/survey-d4f168791e57.
            </p>
            <p>
            Hao, Karen. "An AI saw a cropped photo of AOC. It autocompleted her wearing a bikini." MIT
              Technology Review, edited by Gideon Lichfield, Massachusetts Institute of Technology ,
              29 Jan. 2021,
              www.technologyreview.com/2021/01/29/1017065/ai-image-generation-is-racist-sexist/.
            </p>
            <p>https://v4-3-3.material-ui.com/components/slider/</p>
            <p>https://blog.logrocket.com/react-drag-and-drop/</p>
            <p>https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks</p>
          </div>
        </div>
      );
  }
}

export default App;
