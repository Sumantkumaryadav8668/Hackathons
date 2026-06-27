import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import {
  AlertTriangle,
  ChevronRight,
  Cloud,
  Compass,
  Droplets,
  Eye,
  Gauge,
  History,
  LocateFixed,
  MapPin,
  Moon,
  RefreshCw,
  Search,
  Sun,
  ThermometerSun,
  Trash2,
  Wind,
} from "lucide-react";

import {
  getForecast,
  getWeatherByCoordinates,
  searchLocations,
} from "./api/weatherApi";


const RECENTS_KEY = "atmos:recent-locations";
const DEFAULT_LOCATION = "New York";


const formatTemp = (value) =>
  `${Math.round(value)}°`;


const formatHour = (dateTime) =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    hour12: true,
  }).format(
    new Date(dateTime.replace(" ", "T"))
  );


const formatDay = (date) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(
    new Date(`${date}T12:00:00`)
  );


const getUvLabel = (uv) => {
  if (uv >= 8) return "Very high";
  if (uv >= 6) return "High";
  if (uv >= 3) return "Moderate";
  return "Low";
};



const loadRecents = () => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(RECENTS_KEY)
      ) || []
    );
  } catch {
    return [];
  }
};



function saveRecentLocation(location) {

  const next = [
    {
      id: location.id,
      name: location.name,
      region: location.region,
      country: location.country,

      query:
        `${location.lat},${location.lon}`,

      label:
        [
          location.name,
          location.region,
          location.country,
        ]
          .filter(Boolean)
          .join(", "),
    },

    ...loadRecents().filter(
      (item) =>
        item.id !== location.id
    ),
  ].slice(0,6);


  localStorage.setItem(
    RECENTS_KEY,
    JSON.stringify(next)
  );


  return next;
}



function SkeletonBlock({
  className=""
}) {

  return (
    <div
      className={
        `skeleton rounded-lg ${className}`
      }
    />
  );
}




function WeatherSkeleton(){

  return (

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">

      <div className="space-y-5">

        <section className="rounded-lg bg-white p-6 shadow-soft">

          <SkeletonBlock className="h-6 w-40"/>

          <div className="mt-8 flex justify-between">

            <SkeletonBlock className="h-28 w-44"/>

            <SkeletonBlock className="h-28 w-28"/>

          </div>


          <SkeletonBlock className="mt-8 h-20 w-full"/>

        </section>



        <section className="rounded-lg bg-white p-5 shadow-soft">

          <SkeletonBlock className="h-6 w-36"/>

        </section>

      </div>



      <div className="space-y-5">

        {
          Array.from({
            length:3
          }).map((_,i)=>(

            <SkeletonBlock
              key={i}
              className="h-40"
            />

          ))
        }

      </div>


    </div>

  );
}





function EmptyState({
  onRetry
}){

  return (

    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">

      <Search className="mx-auto h-10 w-10 text-slate-400"/>


      <h2 className="mt-4 text-xl font-semibold">
        No matching location found
      </h2>


      <button
        onClick={onRetry}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-white"
      >

        Retry

      </button>


    </section>

  );

}




function ErrorPanel({
  message,
  onRetry
}){

  return (

    <section className="rounded-lg border border-rose-200 bg-white p-8">

      <div className="flex gap-4">

        <AlertTriangle
          className="text-red-600"
        />


        <div>

          <h2 className="text-xl font-bold">
            Weather data could not load
          </h2>

          <p>{message}</p>


          <button
            onClick={onRetry}
            className="mt-4 rounded bg-black px-4 py-2 text-white"
          >
            Retry
          </button>


        </div>

      </div>


    </section>

  );

}




function SearchBox({
  onSelect,
  recentLocations,
  onClearHistory,
  disabled,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const controllerRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setStatus("idle");
      setError("");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(query, {
          signal: controller.signal,
        });

        setSuggestions(results);
        setStatus(
          results.length
            ? "success"
            : "empty"
        );

        setError("");
      } catch (err) {
        if (
          err.name === "AbortError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        setStatus("error");

        setError(
          err.message ||
            "Search failed"
        );
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);



  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(
          event.target
        )
      ) {
        setShowHistory(false);
        setSuggestions([]);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);




  const selectLocation = (
    location
  ) => {
    onSelect(location);

    setQuery("");
    setSuggestions([]);
    setShowHistory(false);
    setStatus("idle");
  };



  return (
    <div
      ref={searchBoxRef}
      className="relative z-20 w-full max-w-2xl"
    >
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-soft focus-within:border-sky-500">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />

        <input
          value={query}
          disabled={disabled}
          placeholder="Search city, state or country"
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none"
          onFocus={() =>
            setShowHistory(true)
          }
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />
      </div>

      {(query.trim().length >= 2 ||
        (showHistory &&
          recentLocations.length >
            0)) && (
        <div className="absolute mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft animate-slide-up">

          {query.trim().length >=
          2 ? (

            <div className="max-h-80 overflow-y-auto p-2">

              {status ===
                "loading" && (
                <div className="space-y-2 p-2">
                  <SkeletonBlock className="h-12" />
                  <SkeletonBlock className="h-12" />
                </div>
              )}

              {status ===
                "error" && (
                <p className="px-3 py-4 text-sm text-rose-600">
                  {error}
                </p>
              )}

              {status ===
                "empty" && (
                <p className="px-3 py-4 text-sm text-slate-500">
                  No locations found.
                </p>
              )}

              {suggestions.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      selectLocation(
                        item
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-slate-100"
                  >
                    <span>

                      <span className="block text-sm font-semibold text-slate-900">
                        {item.name}
                      </span>

                      <span className="block text-xs text-slate-500">
                        {[
                          item.region,
                          item.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>

                    </span>

                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                )
              )}

            </div>

          ) : (

            <div className="p-2">

              <div className="flex items-center justify-between px-3 py-2">

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <History className="h-4 w-4" />

                  Recent

                </div>

                <button
                  type="button"
                  onClick={
                    onClearHistory
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>

              {recentLocations.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      selectLocation(
                        item
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-slate-100"
                  >
                    <MapPin className="h-4 w-4 text-slate-400" />

                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>
                  </button>
                )
              )}

            </div>

          )}

        </div>
      )}
    </div>
  );
}



function CurrentWeather({
  weather,
  onRefresh,
  refreshing
}) {

  const {
    current,
    location
  } = weather;



  return (

    <section
      className="
      overflow-hidden rounded-lg
      bg-white shadow-soft
      "
    >

      <div
        className="
        bg-gradient-to-br
        from-sky-100
        via-orange-50
        to-green-50
        p-6
        "
      >


        <div
          className="
          flex justify-between
          items-start
          "
        >


          <div>

            <div
              className="
              flex items-center gap-2
              text-sm font-semibold
              text-slate-600
              "
            >

              <MapPin
                className="
                h-4 w-4
                text-green-600
                "
              />

              {
                [
                  location.name,
                  location.region,
                  location.country
                ]
                .filter(Boolean)
                .join(", ")
              }

            </div>


            <p
              className="
              mt-1 text-xs text-slate-500
              "
            >

              Local time {location.localtime}

            </p>


          </div>





          <button

            onClick={onRefresh}

            className="
            flex items-center gap-2
            rounded-lg
            bg-white
            px-3 py-2
            text-sm font-semibold
            "
          >

            <RefreshCw
              className={
                `h-4 w-4 ${
                  refreshing
                  ?
                  "animate-spin"
                  :
                  ""
                }`
              }
            />

            Refresh

          </button>


        </div>







        <div
          className="
          mt-8 flex
          justify-between
          items-end
          "
        >



          <div>


            <div
              className="
              flex items-start
              "
            >

              <span
                className="
                text-7xl
                font-bold
                "
              >

                {
                  formatTemp(
                    current.tempC
                  )
                }

              </span>


              <span
                className="
                mt-2 rounded
                bg-white px-2 py-1
                text-sm font-bold
                "
              >

                C

              </span>


            </div>



            <p
              className="
              mt-3 text-lg
              font-semibold
              "
            >

              {current.condition}

            </p>



            <p
              className="
              text-sm text-slate-600
              "
            >

              Feels like

              {" "}

              {
                formatTemp(
                  current.feelsLikeC
                )
              }

            </p>



          </div>





          {
            current.icon &&

            <img

              src={current.icon}

              alt={current.condition}

              className="
              h-32 w-32
              object-contain
              "

            />

          }



        </div>


      </div>





      <div
        className="
        grid sm:grid-cols-4
        gap-px bg-slate-100
        "
      >

        <MiniMetric

          icon={Wind}

          label="Wind"

          value={
            `${Math.round(
              current.windKph
            )} km/h`
          }

          detail={
            current.windDirection
          }

        />



        <MiniMetric

          icon={Droplets}

          label="Humidity"

          value={
            `${current.humidity}%`
          }

          detail="Relative"

        />



        <MiniMetric

          icon={Sun}

          label="UV Index"

          value={current.uv}

          detail={
            getUvLabel(current.uv)
          }

        />



        <MiniMetric

          icon={Gauge}

          label="Pressure"

          value={
            `${Math.round(
              current.pressureMb
            )} mb`
          }

          detail="Sea level"

        />

      </div>


    </section>

  );

}





function MiniMetric({
  icon:Icon,
  label,
  value,
  detail
}){


  return (

    <div
      className="
      bg-white p-4
      "
    >

      <div
        className="
        flex items-center gap-2
        text-xs font-semibold
        text-slate-500
        "
      >

        <Icon
          className="
          h-4 w-4
          text-sky-600
          "
        />

        {label}

      </div>



      <p
        className="
        mt-2 text-lg font-bold
        "
      >

        {value}

      </p>


      <p
        className="
        text-xs text-slate-500
        "
      >

        {detail}

      </p>


    </div>

  );

}






function HourlyForecast({
  hours
}){


  return (

    <section
      className="
      rounded-lg
      bg-white
      p-5
      shadow-soft
      "
    >


      <h2
        className="
        text-lg font-bold
        "
      >

        Next 24 Hours

      </h2>



      <div
        className="
        mt-4 flex gap-3
        overflow-x-auto
        "
      >


        {
          hours.map(hour=>(


            <article

              key={hour.time}

              className="
              min-w-24
              rounded-lg
              bg-slate-50
              p-3
              text-center
              "
            >


              <p
                className="
                text-xs
                text-slate-500
                "
              >

                {
                  formatHour(
                    hour.time
                  )
                }

              </p>



              {
                hour.icon &&

                <img

                  src={hour.icon}

                  alt={hour.condition}

                  className="
                  mx-auto h-10 w-10
                  "

                />

              }



              <p
                className="
                text-xl font-bold
                "
              >

                {
                  formatTemp(
                    hour.tempC
                  )
                }

              </p>



              <p
                className="
                text-xs text-slate-500
                "
              >

                {
                  hour.chanceOfRain
                }% rain

              </p>



            </article>


          ))
        }


      </div>


    </section>

  );

}



function DailyForecast({
  days
}) {

  return (

    <section
      className="
      rounded-lg bg-white
      p-5 shadow-soft
      "
    >

      <h2
        className="
        text-lg font-bold
        "
      >
        7-Day Forecast
      </h2>


      <div className="mt-4 divide-y">

        {
          days.map(day => (

            <article
              key={day.date}
              className="
              grid grid-cols-[1fr_auto_auto]
              items-center gap-3 py-3
              "
            >

              <div>

                <p className="font-semibold">

                  {
                    formatDay(day.date)
                  }

                </p>


                <p
                  className="
                  text-xs text-slate-500
                  "
                >

                  {day.condition}

                </p>


              </div>



              {
                day.icon &&

                <img

                  src={day.icon}

                  alt={day.condition}

                  className="
                  h-10 w-10
                  "

                />

              }



              <div
                className="
                text-right
                "
              >

                <p
                  className="
                  font-bold
                  "
                >

                  {
                    formatTemp(day.maxC)
                  }


                  {" "}


                  <span
                    className="
                    text-slate-400
                    "
                  >

                    {
                      formatTemp(day.minC)
                    }

                  </span>

                </p>



                <p
                  className="
                  text-xs text-slate-500
                  "
                >

                  {day.chanceOfRain}% rain

                </p>


              </div>


            </article>

          ))
        }


      </div>


    </section>

  );

}






function DetailGrid({
  weather
}) {

  const {
    current,
    astro
  } = weather;



  const details = [

    {
      icon:ThermometerSun,
      label:"Dew Point",
      value:`${Math.round(current.dewPointC)}°C`
    },

    {
      icon:Eye,
      label:"Visibility",
      value:`${current.visibilityKm} km`
    },


    {
      icon:Cloud,
      label:"Cloud Cover",
      value:`${current.cloud}%`
    },


    {
      icon:Compass,
      label:"Wind Direction",
      value:
      `${current.windDirection} ${current.windDegree}°`
    },


    {
      icon:Sun,
      label:"Sunrise",
      value:astro.sunrise
    },


    {
      icon:Sun,
      label:"Sunset",
      value:astro.sunset
    },


    {
      icon:Moon,
      label:"Moon Phase",
      value:astro.moonPhase
    },


    {
      icon:Gauge,
      label:"AQI",
      value:
      `${current.airQuality.index || "--"} ${current.airQuality.label}`
    }


  ];



  return (

    <section
      className="
      grid gap-3 sm:grid-cols-2
      "
    >


      {
        details.map(item=>{

          const Icon=item.icon;


          return (

            <article

              key={item.label}

              className="
              rounded-lg bg-white
              p-4 shadow-soft
              "

            >


              <div
                className="
                flex items-center gap-2
                text-xs font-semibold
                text-slate-500
                "
              >

                <Icon
                  className="
                  h-4 w-4
                  text-sky-600
                  "
                />


                {item.label}


              </div>




              <p
                className="
                mt-3 text-lg font-bold
                "
              >

                {item.value}

              </p>



            </article>

          );


        })
      }


    </section>


  );

}






function Alerts({
  alerts
}) {


  if(!alerts.length){

    return (

      <section
        className="
        rounded-lg
        bg-green-50
        p-4
        text-green-800
        "
      >

        No active weather alerts.

      </section>

    );

  }



  return (

    <section
      className="space-y-3"
    >


      {
        alerts.map(alert=>(


          <article

            key={
              `${alert.event}-${alert.effective}`
            }

            className="
            rounded-lg
            bg-yellow-50
            p-4
            "

          >


            <div
              className="
              flex gap-2
              font-bold
              "
            >

              <AlertTriangle
                className="h-5 w-5"
              />

              {alert.event}


            </div>



            <p
              className="
              mt-2 text-sm
              "
            >

              {
                alert.desc ||
                alert.headline
              }

            </p>


          </article>


        ))
      }


    </section>

  );


}






function App(){


  const [weather,setWeather]=useState(null);

  const [
    selectedQuery,
    setSelectedQuery
  ]=useState(DEFAULT_LOCATION);


  const [
    status,
    setStatus
  ]=useState("loading");


  const [
    error,
    setError
  ]=useState("");


  const [
    recentLocations,
    setRecentLocations
  ]=useState(loadRecents);



  const [
    refreshing,
    setRefreshing
  ]=useState(false);



  const [
    geoStatus,
    setGeoStatus
  ]=useState("");



  const controllerRef=useRef(null);





  const loadWeather =
  useCallback(
  async(
    query=selectedQuery,
    {
      force=false
    }={}
  )=>{


    if(controllerRef.current){

      controllerRef.current.abort();

    }


    const controller =
    new AbortController();


    controllerRef.current =
    controller;



    setStatus(
      weather && !force
      ?
      "transitioning"
      :
      "loading"
    );


    setError("");



    if(force){

      setRefreshing(true);

    }




    try{


      const data =
      await getForecast(
        query,
        {
          signal:
          controller.signal,

          force
        }
      );



      setWeather(data);


      setSelectedQuery(
        `${data.location.lat},${data.location.lon}`
      );



      setRecentLocations(
        saveRecentLocation(
          data.location
        )
      );



      setStatus("success");


    }
    catch(err){


      if(err.name==="AbortError")
      return;



      setError(
        err.message ||
        "Unable to fetch weather"
      );


      setStatus("error");


    }
    finally{


      setRefreshing(false);


    }



  },
  [
    selectedQuery,
    weather
  ]);







  useEffect(()=>{

    loadWeather(DEFAULT_LOCATION);


    return()=>{

      controllerRef.current?.abort();

    };


  },[]);






  const handleLocationSelect=(location)=>{

    loadWeather(
      location.query ||
      `${location.lat},${location.lon}`
    );

  };





  return (

    <main
      className="
      min-h-screen
      bg-[#f5f7fb]
      p-5
      "
    >


      <header
        className="
        rounded-lg bg-white
        p-2 shadow-soft
        mb-5
        "
      >

        <h1
          className="
          text-3xl font-bold
          mb-4 pl-6
          "
        >
          <span>Atmos</span>
          <span className="ml-2 text-teal-800">
            Weather
          </span>
        </h1>


        <SearchBox

          onSelect={
            handleLocationSelect
          }

          recentLocations={
            recentLocations
          }

          onClearHistory={()=>{

            localStorage.removeItem(
              RECENTS_KEY
            );

            setRecentLocations([]);

          }}

          disabled={
            status==="loading"
          }

        />


      </header>





      {
        status==="loading" &&

        <WeatherSkeleton/>

      }



      {
        weather &&
        status!=="loading" &&

        <div
          className="
          grid gap-5
          lg:grid-cols-2
          "
        >

          <div className="space-y-5">


            <CurrentWeather

              weather={weather}

              onRefresh={()=>
                loadWeather(
                  selectedQuery,
                  {
                    force:true
                  }
                )
              }

              refreshing={
                refreshing
              }

            />



            <HourlyForecast

              hours={
                weather.hourly
              }

            />



            <DailyForecast

              days={
                weather.daily
              }

            />


          </div>




          <aside
            className="space-y-5"
          >

            <DetailGrid
              weather={weather}
            />


            <Alerts

              alerts={
                weather.alerts
              }

            />


          </aside>


        </div>

      }


    </main>

  );

}


export default App;