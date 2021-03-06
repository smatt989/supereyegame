import sbt._
import org.scalatra.sbt._
import org.scalatra.sbt.PluginKeys._
import com.earldouglas.xwp.JettyPlugin
import com.mojolly.scalate.ScalatePlugin._
import ScalateKeys._
import java.io.File
import java.nio.file.Files

val Organization = "com.slotkin"
val Name = "SuperEyeGame"
val Version = "0.1.0-SNAPSHOT"
val ScalaVersion = "2.11.8"
val ScalatraVersion = "2.5.0"
val SlickVersion = "3.1.1"

lazy val project = Project (
  "SuperEyeGame",
  file("."),
  settings = Seq(com.typesafe.sbt.SbtStartScript.startScriptForClassesSettings: _*) ++ ScalatraPlugin.scalatraSettings ++ Defaults.coreDefaultSettings ++ ScalatraPlugin.scalatraWithJRebel ++ scalateSettings ++ Seq(
    organization := Organization,
    name := Name,
    version := Version,
    scalaVersion := ScalaVersion,
    resolvers += Classpaths.typesafeReleases,
    resolvers += "Scalaz Bintray Repo" at "http://dl.bintray.com/scalaz/releases",
    libraryDependencies ++= Seq(
      "joda-time" % "joda-time" % "2.9.6",
      "org.scalatra" %% "scalatra" % ScalatraVersion,
      "org.scalatra" %% "scalatra-scalate" % ScalatraVersion,
      "org.scalatra" %% "scalatra-specs2" % ScalatraVersion % "test",
      "org.scalatra" %% "scalatra-json" % ScalatraVersion,
      "org.json4s"   %% "json4s-jackson" % "3.3.0",
      "ch.qos.logback" % "logback-classic" % "1.1.5" % "runtime",
      "org.eclipse.jetty" % "jetty-webapp" % "8.1.10.v20130312" % "compile;container",
      "org.eclipse.jetty.orbit" % "javax.servlet" % "3.0.0.v201112011016" % "compile;container;provided;test" artifacts (Artifact("javax.servlet", "jar", "jar")),
      //"org.eclipse.jetty" % "jetty-webapp" % "9.2.15.v20160210" % "container",
      //"javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided",
      "com.typesafe.slick" %% "slick" % SlickVersion,
      "org.slf4j" % "slf4j-nop" % "1.6.4",
      "com.h2database" % "h2" % "1.4.181",
      "postgresql" % "postgresql" % "9.1-901.jdbc4",
      "com.mchange" % "c3p0" % "0.9.5.1",
      "org.scalatra" %% "scalatra-auth" % ScalatraVersion,
      "org.mindrot" % "jbcrypt" % "0.3m",
      "io.netty" % "netty-tcnative-boringssl-static" % "1.1.33.Fork24",
      "org.eclipse.jetty.alpn" % "alpn-api" % "1.1.3.v20160715",
      "com.relayrides" % "pushy" % "0.9.2",
      "com.amazonaws" % "aws-java-sdk" % "1.11.46",
      "org.scala-lang" % "scala-reflect" % scalaVersion.value,
      "com.typesafe.slick" %% "slick-codegen" % SlickVersion
    ),
    scalacOptions := Seq("-feature"),
    mainClass in Compile := Some("JettyLauncher"),
    scalateTemplateConfig in Compile <<= (sourceDirectory in Compile){ base =>
      Seq(
        TemplateConfig(
          base / "webapp" / "WEB-INF" / "templates",
          Seq.empty,  /* default imports should be added here */
          Seq(
            Binding("context", "_root_.org.scalatra.scalate.ScalatraRenderContext", importMembers = true, isImplicit = true)
          ),  /* add extra bindings here */
          Some("templates")
        )
      )
    }
  )
).enablePlugins(JettyPlugin)

lazy val codeGen = InputKey[Unit]("db-gen", "Start DB.")
fullRunInputTask(codeGen, Compile, "com.example.app.migrations.CodeGenerator")

lazy val dbSetup = InputKey[Unit]("db-setup", "Setup db")
fullRunInputTask(dbSetup, Compile, "com.example.app.migrations.DBSetup")
