# Find the Winning Move
[POJ1568 ZOJ1703 UVA10111]

4x4 tic-tac-toe is played on a board with four rows (numbered 0 to 3 from top to bottom) and four columns (numbered 0 to 3 from left to right). There are two players, x and o, who move alternately with x always going first. The game is won by the first player to get four of his or her pieces on the same row, column, or diagonal. If the board is full and neither player has won then the game is a draw.
Assuming that it is x's turn to move, x is said to have a forced win if x can make a move such that no matter what moves o makes for the rest of the game, x can win. This does not necessarily mean that x will win on the very next move, although that is a possibility. It means that x has a winning strategy that will guarantee an eventual victory regardless of what o does.  
Your job is to write a program that, given a partially-completed game with x to move next, will determine whether x has a forced win. You can assume that each player has made at least two moves, that the game has not already been won by either player, and that the board is not full. 

枚举当前$x$摆在哪个位置，然后对抗搜索。对于$x$，若能转移到任何一个必胜状态，则该状态必胜。对于$o$，若当前状态能转移到任何一个必败或平局状态，则一定不胜。  
另外，如果棋子个数小于等于$4$个，则一定无必胜状态。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=5;
const int inf=2147483647;

int mcnt,Win[11];
int Map[4][4];

int dfs(int k1,int k2,int opt);
int check(int key);

int main()
{
	char opt;
	for (int cnt=0,i=0;i<4;i++)
		for (int j=0;j<4;j++)
			Map[i][j]=(1<<(cnt++));
	mcnt=-1;
	for (int i=0;i<=3;i++) Win[++mcnt]=Map[i][0]|Map[i][1]|Map[i][2]|Map[i][3],Win[++mcnt]=Map[0][i]|Map[1][i]|Map[2][i]|Map[3][i];
	Win[++mcnt]=Map[0][0]|Map[1][1]|Map[2][2]|Map[3][3];
	Win[++mcnt]=Map[0][3]|Map[1][2]|Map[2][1]|Map[3][0];
	
	while (cin>>opt)
	{
		if (opt=='$') break;
		int key1=0,key2=0;
		char mp[5];
		int cnt=0;
		for (int i=0;i<=3;i++)
		{
			cin>>mp;
			for (int j=0;j<=3;j++)
				if (mp[j]=='x') key1|=Map[i][j],cnt++;
				else if (mp[j]=='o') key2|=Map[i][j],cnt++;
		}
		if (cnt<=4)
		{
			printf("#####\n");
			continue;
		}
		bool flag=0;
		for (int i=0;i<=15;i++)
			if (((key1&(1<<i))==0)&&((key2&(1<<i))==0))
				if (dfs(key1|(1<<i),key2,1)==1){
					printf("(%d,%d)\n",i/4,i%4);flag=1;break;
				}
		if (flag==0) printf("#####\n");
	}
	return 0;
}

int dfs(int k1,int k2,int opt)
{
	if ((opt==1)&&(check(k1)==1)) return 1;
	if ((opt==0)&&(check(k2)==1)) return -1;
	if ((k1|k2)==(1<<16)-1) return 0;
	//cout<<"dfs:"<<k1<<" "<<k2<<" "<<opt<<endl;
	for (int i=0;i<=15;i++)
		if ( ((k1&(1<<i))==0) && ((k2&(1<<i))==0) )
		{
			if (opt==0)
				if (dfs(k1|(1<<i),k2,opt^1)==1) return 1;
			if (opt==1)
			{
				int ret=dfs(k1,k2|(1<<i),opt^1);
				if ((ret==-1)||(ret==0)) return -1;
			}
		}
	if (opt==0) return -1;
	if (opt==1) return 1;
}

int check(int key)
{
	for (int i=0;i<=mcnt;i++)
		if ((key&Win[i])==Win[i]) return 1;
	return 0;
}
```