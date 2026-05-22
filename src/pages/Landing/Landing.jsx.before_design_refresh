import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

import { Link } from 'react-router-dom'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 96px 24px 64px;
`

const TopLeftActions = styled.div`
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 1000;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto 64px;
  padding: 28px 20px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
`

const SectionTitle = styled.h2`
  font-size: 34px;
  line-height: 1.1;
  margin-bottom: 14px;
`

const Subtitle = styled.h3`
  font-size: 22px;
  line-height: 1.2;
  margin: 18px 0 12px;
`

const Lead = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 14px;
`

const MediaRow = styled.div`
  display: flex;
  gap: 18px;
  align-items: stretch;
  margin: 16px 0 18px;
  flex-wrap: wrap;
`

const VideoCard = styled.div`
  flex: 1 1 260px;
  min-width: 240px;
  border-radius: 14px;
  overflow: hidden;
  background: #000;

  video {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
`

const FrameVideoCard = styled.div`
  flex: 1 1 260px;
  min-width: 240px;
  border-radius: 14px;
  overflow: hidden;
  background: #000;
  position: relative;

  .mainVideo {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }

  .frameVideo {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 46%;
    height: 46%;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.95);
    object-fit: cover;
    display: block;
  }
`

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const GalleryCard = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  background: transparent;
  text-align: left;

  img {
    width: 100%;
    height: 210px;
    object-fit: cover;
    border-radius: 14px;
    display: block;
  }

  &:hover img {
    filter: brightness(1.03);
  }
`

const CopyCard = styled.div`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
`

function shuffle(arr) {
  // Простая рандомизация порядка. Для UI достаточно.
  return [...arr].sort(() => Math.random() - 0.5)
}

const VideoLoop = ({ src, muted = true, className }) => (
  <video
    src={src}
    autoPlay
    muted={muted}
    loop
    playsInline
    preload='metadata'
    className={className}
  />
)

const Landing = () => {
  useEffect(() => {
    document.title = 'Scratch.ru – визуальное программирование на русском языке!'
  }, [])

  const materialsBase = '/materials'

  const [v1to3, setV1to3] = useState([])
  const [v4to6, setV4to6] = useState([])

  const galleryItems = useMemo(() => {
    const imgs = ['img1.jpg', 'img2.jpg', 'img3.jpg']
    return shuffle(imgs).map((file, idx) => ({
      file,
      url: `https://scratch.ru/example${idx + 1}`,
    }))
  }, [])

  useEffect(() => {
    setV1to3(shuffle(['vid1.mp4', 'vid2.mp4', 'vid3.mp4']))
    setV4to6(shuffle(['vid4.mp4', 'vid5.mp4', 'vid6.mp4']))
  }, [])

  const v7 = `${materialsBase}/vid7.mp4`

  return (
    <React.Fragment>
      <TopLeftActions>
        <Link to='/login'>
          <Button>Войти</Button>
        </Link>
        <Link to='/register'>
          <Button>Регистрация</Button>
        </Link>
        <Button
          type='primary'
          href='https://scratch.ru'
          target='_blank'
          rel='noreferrer'
        >
          Создавать
        </Button>
      </TopLeftActions>

      <Container>
        <Section>
          <CopyCard>
            Scratch.ru - российская суверенная онлайн-платформа для визуального программирования и язык программирования для детей и взрослых
          </CopyCard>
          <SectionTitle>Scratch.ru – визуальное программирование на русском языке!</SectionTitle>

          <Subtitle>1.1. о программировании Виртуальных исполнителей алгоритмов</Subtitle>
          <Lead>
            Scratch.ru - среда для создания проектов игр, викторин, мультфильмов, анимационных историй.
            (Это для взрослых, поэтому мы сознательно перечисляем типы проектов, которые мы ждем на Олимпиаде.)
          </Lead>

          <MediaRow>
            {v1to3.map(file => (
              <VideoCard key={file}>
                <VideoLoop src={`${materialsBase}/${file}`} />
              </VideoCard>
            ))}
          </MediaRow>

          <Button
            type='primary'
            href='https://scratch.ru/'
            target='_blank'
            rel='noreferrer'
          >
            НАЧАТЬ ПРОГРАММИРОВАТЬ
          </Button>

          <Subtitle>1.2. о программировании РОБОТОВ - реальных исполнителей алгоритмов</Subtitle>
          <Lead>Scratch.ru среда для программирования роботов РОББО</Lead>

          <MediaRow>
            {v4to6.map(file => (
              <FrameVideoCard key={file}>
                <VideoLoop
                  src={`${materialsBase}/${file}`}
                  className='mainVideo'
                />
                <VideoLoop
                  src={`${materialsBase}/${file}`}
                  className='frameVideo'
                />
              </FrameVideoCard>
            ))}
          </MediaRow>

          <Button
            type='primary'
            href='https://scratch.ru/'
            target='_blank'
            rel='noreferrer'
          >
            НАЧАТЬ ПРОГРАММИРОВАТЬ РОБОТА РОББО
          </Button>
        </Section>

        <Section>
          <SectionTitle>2. Scratch-олимпиада</SectionTitle>
          <Lead>Ежегодная международная олимпиада, 2 номинации, даты и примеры работ в виде гифок победителей</Lead>

          <Subtitle>2.1. Краткая Лента времени с ключевыми датами</Subtitle>
          <Lead>дата 1</Lead>
          <Lead>дата 2</Lead>
          <Lead>дата 3</Lead>
          <Lead>дата 4</Lead>
          <Lead>дата 5</Lead>

          <CopyCard style={{ marginTop: 14 }}>
            прием заявок на российский межрегиональный отборочный тур
            <br />
            прием заявок на российский отборочный тур
            <br />
            прием заявок на международный этап
            <br />
            международный этап
            <br />
            награждение победителей международный этап
          </CopyCard>

          <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button type='link' disabled>Подробнее</Button>
            <Button type='link' disabled>Подробнее</Button>
            <Button type='link' disabled>Подробнее</Button>
            <Button type='link' disabled>Подробнее</Button>
          </div>

          <Subtitle style={{ marginTop: 26 }}>2.2. Трейлер Олимпиады</Subtitle>
          <VideoCard style={{ margin: '14px 0 18px', maxWidth: 520 }}>
            <VideoLoop src={v7} />
          </VideoCard>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              type='primary'
              href='https://creativeprogramming.org/'
              target='_blank'
              rel='noreferrer'
            >
              УЗНАТЬ БОЛЬШЕ про МЕЖДУНАРОДНУЮ Scratch-Олимпиаду
            </Button>
            <Button
              href='https://robbo.ru/olymp/'
              target='_blank'
              rel='noreferrer'
            >
              УЗНАТЬ БОЛЬШЕ про Российский этап Scratch - ОЛИМПИАДЫ
            </Button>
          </div>

          <Subtitle style={{ marginTop: 26 }}>Примеры проектов</Subtitle>
          <Lead>Галерея с привлекательными картинками-скриншотами (гифками ). При клике на картинку открывается проект.</Lead>
          <GalleryGrid>
            {galleryItems.map(({ file, url }) => (
              <GalleryCard
                key={file}
                type='button'
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              >
                <img src={`${materialsBase}/${file}`} alt='Example project' />
              </GalleryCard>
            ))}
          </GalleryGrid>
        </Section>

        <Section>
          <SectionTitle>3. Педагогам</SectionTitle>

          <Subtitle>3.1 Изучаем Скретч</Subtitle>
          <Lead>
            Курс Секреты Scratch предназначен для детей от 7 лет и старше. Участники разработают свою анимационную историю и смогут отправить ее на Scratch Олимпиаду.
            В основном дети могут пройти курс самостоятельно.
          </Lead>
          <Lead>
            Роль родителей и педагогов заключается в помощи детям в соблюдении безопасности при работе за компьютером.
            Поддержка взрослых может понадобиться при установке ROBBO Scratch на устройство ребенка.
          </Lead>
          <Button
            type='primary'
            href='https://lms2.robbo.world/courses/course-v1:Robbo+AC002+June/about'
            target='_blank'
            rel='noreferrer'
          >
            НАЧНИ бесплатно ИЗУЧЕНИЕ Scratch
          </Button>

          <Subtitle>3.2 Изучаем критерии оценки олимпиадных работ в дисциплине Scratch</Subtitle>
          <Lead>
            Курс предназначен для членов жюри дисциплины Scratch в рамках Российского национального отборочного этапа Международной Scratch-Олимпиады по креативному программированию.
          </Lead>
          <Lead>В состав жюри могут войти только педагоги с опытом преподавания Scratch.</Lead>
          <div style={{ marginTop: 10 }}>
            <Button
              type='primary'
              href='#'
              disabled
            >
              СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В в дисциплине Scratch
            </Button>
          </div>

          <Subtitle>3.3 Изучаем критерии оценки олимпиадных работ в дисциплине RobboScratch</Subtitle>
          <Lead>
            Курс предназначен для членов жюри дисциплины RobboScratch — креативное программирование на RobboScratch с использованием мобильных роботов и цифровых лабораторий РОББО.
          </Lead>
          <Lead>В состав жюри могут войти только педагоги с опытом работы на оборудовании РОББО.</Lead>
          <div style={{ marginTop: 10 }}>
            <Button
              type='primary'
              href='#'
              disabled
            >
              СТАТЬ ЭКСПЕРТОМ ПРОВЕРКИ РАБОТ В в дисциплине RobboScratch
            </Button>
          </div>
        </Section>

        <Section>
          <SectionTitle>4. О РОББО</SectionTitle>

          <Subtitle>О компании</Subtitle>
          <Lead>
            Модернизация урока &quot;Технология&quot;. Инженерный инновационный РОББО Класс{' '}
            <a
              href='https://innoclass.ru/'
              target='_blank'
              rel='noreferrer'
            >
              https://innoclass.ru/
            </a>
          </Lead>

          <Subtitle>4.2. Методика преподавания</Subtitle>
          <Lead>
            Тут еще раз говорим про то что скретч.ру поддерживает традиц ценности, потом напоминаем инструкцию по использованию, потом текст про уникальные возможности при обучении программированию и далее про ЭУМК РОББО.
          </Lead>
          <Lead>Квик-гайд</Lead>

          <Subtitle style={{ marginTop: 18 }}>Это первоначальный список:</Subtitle>
          <CopyCard>
            <div style={{ marginBottom: 10 }}>
              Инструкция для педагогов - как открыть, как сохранить
            </div>
            <div style={{ marginBottom: 10 }}>
              <a
                href='https://scratch.ru'
                target='_blank'
                rel='noreferrer'
              >
                Начать работу
              </a>{' '}
              - переход на нынешний scratch.ru
            </div>
            <div style={{ marginBottom: 10 }}>
              Кнопки как в футере - на Секреты Скретч, Заявки на покупку оборудования Иннокласс, заявка на участие в Scratch-Олимпиаде, заявка на обучение педагогов
            </div>
            <div style={{ marginBottom: 10 }}>
              Ссылки на Протокол с работами - #
            </div>
            <div style={{ marginBottom: 10 }}>
              Видео лучших работ в номинации RobboScratch - #
            </div>
          </CopyCard>
        </Section>
      </Container>
    </React.Fragment>
  )
}

export default Landing

