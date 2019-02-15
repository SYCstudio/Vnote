# Moving Pebbles
[BZOJ1982 SPOJ-PEBBMOV]

 给你N堆Stone，两个人玩游戏. 每次任选一堆，首先拿掉至少一个石头,然后移动任意个石子到任意堆中. 谁不能移动了，谁就输了... 

由于石子之间会互相影响，所以不能把每堆石子拆开然后求 Nim 和。当石子个数为偶数个并且相同个数的石子可以一一配对的时候是先手必败状态。下面证明三个正确性命题。

这个判断将所有结束位置判断为 $P$ 点：显然最后的终状态满足条件。
根据这个判断得出的 $N$ 点一定能走到一个 $P$ 点：当石子个数为奇数个的时候，把石子排序，第一小的与第二小的配对，第三小的与第四小的配对，直到剩下最后一个，用这最后一个去补充前面所有的差值，剩下的直接丢掉，得到一个 P 状态。而当石子为偶数个的时候，同样排序后，用最大的与最小的匹配，第二小的与第三小的匹配，第四小的与第五小的匹配，依次类推，然后把最大的中多的部分补充到其它的差值中，得到一个 P 状态。
根据这个判断得出的 $P$ 点一定不能走到一个 $P$ 点：当原本偶数堆石子已经一一匹配时，无论怎么操作都会破坏一一匹配的状态。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<string>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int inf=2147483647;

int n;
string Seq[maxN];

void Do();

int main(){
	while (cin>>n){
		Do();
	}
	return 0;
}

void Do(){
	for (int i=1;i<=n;i++) cin>>Seq[i];
	if (n&1){
		printf("first player\n");return;
	}
	sort(&Seq[1],&Seq[n+1]);
	for (int i=1;i<=n;i+=2)
		if (Seq[i]!=Seq[i+1]){
			printf("first player\n");return;
		}
	printf("second player\n");return;
}
```