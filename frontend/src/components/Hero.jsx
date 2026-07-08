export default function Hero() {
  return (
    <section className="bg-white rounded-3xl shadow-md p-10">

      <h1 className="text-3xl font-bold text-slate-900">

        Welcome to

        <span className="text-blue-600">
          {" "}GNSS Virtual Laboratory
        </span>

      </h1>

      <p className="mt-6 text-base text-slate-600 max-w-3xl">

        An interactive platform where students can learn,
        simulate, analyze and visualize Global Navigation
        Satellite Systems using modern engineering tools.

      </p>

      <div className="mt-8 flex gap-5">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl">

          Start Learning

        </button>

        <button className="border border-slate-300 px-7 py-3 rounded-xl hover:bg-slate-100">

          Run Simulation

        </button>

      </div>

    </section>
  );
}