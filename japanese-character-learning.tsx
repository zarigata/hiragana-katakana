"use client"

import React, { useState, useEffect, useRef } from 'react'

const hiragana = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po'
}

const katakana = {
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po'
}

interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function Component() {
  const [writingSystem, setWritingSystem] = useState<'hiragana' | 'katakana'>('hiragana')
  const [currentChar, setCurrentChar] = useState('')
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [petals, setPetals] = useState<Petal[]>([])
  const [explosionPetals, setExplosionPetals] = useState<Petal[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)

  const getRandomChar = (obj: typeof hiragana | typeof katakana) => {
    const keys = Object.keys(obj)
    return keys[Math.floor(Math.random() * keys.length)]
  }

  const nextChar = () => {
    setCurrentChar(getRandomChar(writingSystem === 'hiragana' ? hiragana : katakana))
    setUserInput('')
    setFeedback('')
  }

  useEffect(() => {
    nextChar()
  }, [writingSystem])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to drop a petal every 100ms
        setPetals(prevPetals => [
          ...prevPetals,
          {
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: -50,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5
          }
        ])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setPetals(prevPetals => 
        prevPetals
          .map(petal => ({ ...petal, y: petal.y + 1 }))
          .filter(petal => petal.y < window.innerHeight)
      )
      setExplosionPetals(prevPetals => 
        prevPetals
          .map(petal => ({
            ...petal,
            x: petal.x + (Math.random() - 0.5) * 5,
            y: petal.y + (Math.random() - 0.5) * 5,
            rotation: petal.rotation + Math.random() * 10
          }))
          .filter(petal => petal.scale > 0.1)
          .map(petal => ({ ...petal, scale: petal.scale * 0.95 }))
      )
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [petals, explosionPetals])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correct = (writingSystem === 'hiragana' ? hiragana : katakana)[currentChar]
    if (userInput.toLowerCase() === correct) {
      setFeedback('正解! (Correct!)')
      if (audioRef.current) {
        audioRef.current.play()
      }
      // Create explosion effect
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const newExplosionPetals = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        rotation: Math.random() * 360,
        scale: 1
      }))
      setExplosionPetals(prev => [...prev, ...newExplosionPetals])
      setTimeout(nextChar, 1500)
    } else {
      setFeedback(`不正解 (Incorrect). The correct answer is: ${correct}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e6f31762-e1e4-4745-b1b7-c64ce36c20df-vG5HBjbA4wnVnoE4ZDhsrFpvef7Aek.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="absolute inset-0 bg-white opacity-30"></div>
      <div className="falling-petals">
        {petals.map(petal => (
          <img
            key={petal.id}
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/af00f217a09f037d633e19ac0a550236-cXlcEDHKrnDi8y0m8iAIqqEWpjHiIC.gif"
            alt=""
            className="petal"
            style={{
              left: `${petal.x}px`,
              top: `${petal.y}px`,
              transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            }}
          />
        ))}
        {explosionPetals.map(petal => (
          <img
            key={petal.id}
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/af00f217a09f037d633e19ac0a550236-cXlcEDHKrnDi8y0m8iAIqqEWpjHiIC.gif"
            alt=""
            className="petal explosion"
            style={{
              left: `${petal.x}px`,
              top: `${petal.y}px`,
              transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
            }}
          />
        ))}
      </div>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">日本語学習</h1>
          <select
            value={writingSystem}
            onChange={(e) => setWritingSystem(e.target.value as 'hiragana' | 'katakana')}
            className="p-2 border rounded"
          >
            <option value="hiragana">Hiragana</option>
            <option value="katakana">Katakana</option>
          </select>
        </div>
        <div className="text-center mb-6">
          <span className="text-9xl font-bold text-indigo-700">{currentChar}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type romaji here"
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-4">
            <button type="submit" className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded">
              Check / 確認
            </button>
            <button type="button" onClick={nextChar} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded">
              Skip / スキップ
            </button>
          </div>
        </form>
        {feedback && (
          <p className={`mt-4 text-center ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}
      </div>
      <audio ref={audioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BONK-Zyh081p4XaXYfN6lWahTOPN6uVFww6.mp3" />
      <style jsx>{`
        .falling-petals {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .petal {
          position: absolute;
          width: 30px;
          height: 30px;
          object-fit: contain;
          pointer-events: none;
        }
        .explosion {
          transition: all 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}