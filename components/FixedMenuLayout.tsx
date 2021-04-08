import { useRouter } from 'next/router';
import { Container, Dropdown, Image, List, Menu, Segment } from 'semantic-ui-react';

const FixedMenuLayout = ({ children, allPosts }) => {
    const router = useRouter();

    return (<div>
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item as='a' header onClick={() => router.push('/')}>
                    <Image size='mini' src='/assets/MainHUD_Heroes.png' style={{ marginRight: '1.5em' }} /> Characters
                </Menu.Item>
                <Menu.Item as='a' onClick={() => router.push('/missions')}>Missions</Menu.Item>
                <Menu.Item as='a' onClick={() => router.push('/wiki/about')}>About</Menu.Item>

                <Dropdown item simple text='Other pages'>
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>Particles</Dropdown.Item>
                        <Dropdown.Item disabled>Gears</Dropdown.Item>
                        <Dropdown.Item>
                            <i className='dropdown icon' />
                            <span className='text'>Wiki</span>
                            <Dropdown.Menu>
                                {allPosts.map(post => <Dropdown.Item key={post.slug} onClick={() => router.push(`/wiki/${post.slug}`)}>{post.title}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Menu>

        <Container style={{ marginTop: '7em' }}>
            {children}
        </Container>

        <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
            <Container textAlign='center'>
                <List horizontal inverted divided link size='small'>
                    <List.Item as='a' href='https://discord.gg/SzkVaFJCa5'>Official Discord</List.Item>
                    <List.Item as='a' href='https://tpgames.co/g3t'>Official Forums</List.Item>
                    <List.Item as='a' href='https://tpgames.co/4f6fc'>Official Game FAQs</List.Item>
                    <List.Item as='a' href='https://github.com/TemporalAgent7/LegendsDataCore'>This project's GitHub</List.Item>
                </List>
                <p style={{ fontSize: '0.75em' }}>Note: Assets and some text elements like names and descriptions are owned by Tilting Point or their licensors. This project is not associated with nor endorsed by Tilting Point or ViacomCBS.</p>
            </Container>
        </Segment>
    </div>
    );
}

export default FixedMenuLayout;